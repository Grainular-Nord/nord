import {
    downloadProject,
    type NordEditorEngineOptions,
    projectFromLocation,
    projectShareUrl,
} from '@grainular/codemirror';
import type { CodeEditorControls } from './components/code-editor/types';
import { playgroundFiles } from './editor-files/playground';
import { formatTypeScript } from './lib/format';

/** Packages intentionally exposed by the Nørd playground preview. */
export const playgroundImports = {
    '@grainular/grains': 'https://esm.sh/@grainular/grains@next',
    '@grainular/nord': 'https://esm.sh/@grainular/nord@next',
};

export const virtualProject = async (base: string) => {
    if (base === '/playground/') return playgroundFiles.map((file) => ({ ...file }));
    const manifest = await fetch(`${base}files.json`).then((response) => response.json() as Promise<string[]>);
    return Promise.all(
        manifest.map(async (path) => ({
            path,
            contents: await fetch(`${base}${path}`).then((response) => response.text()),
        })),
    );
};

/** The playground's complete editor contract: virtual files, exposed modules, and optional host tools. */
export const createPlaygroundEditorConfig = ({
    controls,
    src,
}: {
    controls?: CodeEditorControls;
    src: string;
}): NordEditorEngineOptions => {
    // A share link carries the exact project the sender saw; load it verbatim
    // instead of the lesson's (formatted) starter files.
    const shared = projectFromLocation();

    return {
        files: async () => {
            if (shared) return shared.files.map((file) => ({ ...file }));
            return Promise.all(
                (await virtualProject(src)).map(async (file) => {
                    if (!/\.tsx?$/.test(file.path)) return file;
                    try {
                        return {
                            ...file,
                            contents: await formatTypeScript(file.contents),
                        };
                    } catch {
                        return file;
                    }
                }),
            );
        },
        format: async (contents, path) => (/\.tsx?$/.test(path) ? formatTypeScript(contents) : contents),
        imports: playgroundImports,
        initialLayout: shared?.layout,
        initialPath: shared?.activePath,
        tools: [
            (editor) =>
                controls?.format === false
                    ? undefined
                    : {
                          id: 'format',
                          label: 'Format',
                          run: editor.format,
                          title: 'Format file (Ctrl/Cmd+S)',
                      },
            (editor) => ({
                id: 'run',
                label: 'Run',
                run: editor.run,
                title: 'Run preview (Ctrl/Cmd+Enter)',
            }),
            (editor) => (controls?.reset ? { id: 'reset', label: 'Reset', run: editor.reset } : undefined),
            (editor) =>
                controls?.solve
                    ? {
                          id: 'solve',
                          label: 'Solve',
                          run: async () => {
                              try {
                                  const solution = await virtualProject(`${src}solution/`);
                                  const changes = new Map(solution.map((file) => [file.path, file]));
                                  const initial = editor.initialFiles();
                                  const knownPaths = new Set(initial.map((file) => file.path));
                                  await editor.applyProject([
                                      ...initial.map((file) => changes.get(file.path) ?? file),
                                      ...solution.filter((file) => !knownPaths.has(file.path)),
                                  ]);
                              } catch (error) {
                                  editor.reportError(
                                      error instanceof Error ? error.message : 'Failed to load the lesson solution.',
                                  );
                              }
                          },
                      }
                    : undefined,
            (editor) =>
                controls?.share
                    ? {
                          id: 'share',
                          label: 'Share',
                          title: 'Copy a link to this project',
                          run: async () => {
                              const url = projectShareUrl({
                                  activePath: editor.activePath(),
                                  files: editor.files(),
                                  layout: editor.layout(),
                              });
                              history.replaceState(null, '', url);
                              await navigator.clipboard?.writeText(url).catch(() => undefined);
                          },
                      }
                    : undefined,
            (editor) =>
                controls?.download
                    ? {
                          id: 'download',
                          label: 'Download',
                          run: () => downloadProject(editor.files(), 'nord-app'),
                      }
                    : undefined,
        ],
    };
};
