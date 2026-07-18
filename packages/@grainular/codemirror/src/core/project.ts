// Reusable mutable project state, independent of the Nørd preview engine.
import { combined, derived, grain } from '@grainular/grains';
import type { EditorFile } from './types';

/** Returns a detached copy of a virtual project. */
export const cloneProject = (project: EditorFile[]) => project.map((file) => ({ ...file }));

/** Appends `.ts` unless the name already carries a script extension. */
export const ensureScriptPath = (name: string) => (/\.[cm]?[jt]sx?$/.test(name) ? name : `${name}.ts`);

/**
 * Small project-only state helper for custom editor compositions.
 *
 * Unlike `createNordEditorEngine`, it has no preview, formatter, or lifecycle
 * concerns; it only manages a mutable file set and active-file selection.
 */
export const createEditorProject = (initialFiles: EditorFile[] = []) => {
    const files = grain(cloneProject(initialFiles));
    const activePath = grain(initialFiles.find((file) => file.path === 'main.ts')?.path ?? initialFiles[0]?.path);
    const fileTreeOpen = grain(false);
    const activeFile = derived(combined([files, activePath]), ([project, path]) =>
        project.find((file) => file.path === path),
    );

    const select = (path: string) => activePath.set(path);
    const update = (contents: string) => {
        const path = activePath();
        if (!path) return;
        files.update((project) => project.map((file) => (file.path === path ? { ...file, contents } : file)));
    };
    const add = (name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return undefined;
        const path = ensureScriptPath(trimmed);
        if (files().some((file) => file.path === path)) return undefined;
        files.update((project) => [...project, { contents: `// ${path}\nexport {};\n`, path }]);
        activePath.set(path);
        return path;
    };
    const remove = (path: string) => {
        if (files().length <= 1) return false;
        files.update((project) => project.filter((file) => file.path !== path));
        if (activePath() === path)
            activePath.set(files().find((file) => file.path === 'main.ts')?.path ?? files()[0]?.path);
        return true;
    };
    const rename = (path: string, name: string) => {
        const nextPath = name.trim();
        if (!nextPath || nextPath === path || files().some((file) => file.path === nextPath)) return undefined;
        files.update((project) => project.map((file) => (file.path === path ? { ...file, path: nextPath } : file)));
        if (activePath() === path) activePath.set(nextPath);
        return nextPath;
    };

    return {
        activeFile,
        activePath,
        add,
        fileTreeOpen,
        files,
        remove,
        rename,
        select,
        update,
    };
};

/** Return type of `createEditorProject` for consumers composing their own UI. */
export type EditorProject = ReturnType<typeof createEditorProject>;
