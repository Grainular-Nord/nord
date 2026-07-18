import { formatTypeScript } from '../../lib/format';
import type { ControllerState } from './controller-state';
import type { createProjectTools } from './project-tools';
import type { ProjectFile } from './types';

type ProjectTools = ReturnType<typeof createProjectTools>;

const formatProject = async (project: ProjectFile[]) =>
    Promise.all(
        project.map(async (file) => {
            if (!/\.tsx?$/.test(file.path)) return file;
            try {
                return { ...file, contents: await formatTypeScript(file.contents) };
            } catch {
                return file;
            }
        }),
    );

export const createLessonTools = ({
    projects,
    reportError,
    run,
    state,
    src,
}: {
    projects: ProjectTools;
    reportError: (message: string) => void;
    run: () => Promise<void>;
    state: ControllerState;
    src: string;
}) => {
    const formatInitialProject = (project: ProjectFile[]) => formatProject(project);
    const formatActiveFile = async () => {
        const current = state.activeFile();
        if (!current) return;
        try {
            const contents = await formatTypeScript(current.contents);
            if (state.activePath() !== current.path) return;
            state.files.update((project) =>
                project.map((file) => (file.path === current.path ? { ...file, contents } : file)),
            );
            await run();
        } catch (error) {
            reportError(error instanceof Error ? error.message : 'Failed to format this file.');
        }
    };
    const resetLesson = async () => {
        const initial = projects.initialProject();
        if (initial.length > 0) await projects.applyProject(initial);
    };
    const solveLesson = async () => {
        try {
            const changes = await projects.loadProject(`${src}solution/`);
            if (changes.length === 0) throw new Error('This lesson has no solution yet.');
            const initial = projects.initialProject();
            const byPath = new Map(changes.map((file) => [file.path, file]));
            const initialPaths = new Set(initial.map((file) => file.path));
            await projects.applyProject([
                ...initial.map((file) => byPath.get(file.path) ?? file),
                ...changes.filter((file) => !initialPaths.has(file.path)),
            ]);
        } catch (error) {
            reportError(error instanceof Error ? error.message : 'Failed to load the lesson solution.');
        }
    };

    return { formatActiveFile, formatInitialProject, resetLesson, solveLesson };
};
