import type { ControllerState } from './controller-state';
import { cloneProject } from './controller-state';
import type { ProjectFile } from './types';

export const createProjectTools = ({
    state,
    onChange,
    run,
}: {
    state: ControllerState;
    onChange: () => void;
    run: () => Promise<void>;
}) => {
    let initialFiles: ProjectFile[] = [];

    const applyProject = async (project: ProjectFile[]) => {
        state.files.set(cloneProject(project));
        state.activePath.set(project.find((file) => file.path === 'main.ts')?.path ?? project[0]?.path);
        await run();
    };
    const loadProject = async (base: string) => {
        const manifest = await fetch(`${base}files.json`).then((response) => response.json() as Promise<string[]>);
        return Promise.all(
            manifest.map(async (path) => ({
                path,
                contents: await fetch(`${base}${path}`).then((response) => response.text()),
            })),
        );
    };
    const setInitialProject = (project: ProjectFile[]) => {
        initialFiles = cloneProject(project);
    };
    const updateActiveFile = (contents: string) => {
        const path = state.activePath();
        if (!path) return;
        state.files.update((project) => project.map((file) => (file.path === path ? { ...file, contents } : file)));
        onChange();
    };
    const addFile = (name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const path = /\.tsx?$/.test(trimmed) ? trimmed : `${trimmed}.ts`;
        if (state.files().some((file) => file.path === path)) {
            state.status.set(`"${path}" already exists.`);
            return;
        }
        state.files.update((project) => [...project, { path, contents: `// ${path}\nexport {};\n` }]);
        state.activePath.set(path);
        onChange();
    };
    const deleteFile = (path: string) => {
        if (state.files().length <= 1) return;
        state.files.update((project) => project.filter((file) => file.path !== path));
        if (state.activePath() === path)
            state.activePath.set(state.files().find((file) => file.path === 'main.ts')?.path ?? state.files()[0]?.path);
        onChange();
    };

    return {
        addFile,
        applyProject,
        deleteFile,
        initialProject: () => cloneProject(initialFiles),
        loadProject,
        setInitialProject,
        updateActiveFile,
    };
};
