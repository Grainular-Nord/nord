import { combined, derived, grain } from '@grainular/grains';
import type { EditorLayout, PlaygroundDiagnostic, PreviewEvent, ProjectFile } from './types';

export const cloneProject = (project: ProjectFile[]) => project.map((file) => ({ ...file }));

export const createControllerState = () => {
    const files = grain<ProjectFile[]>([]);
    const activePath = grain<string | undefined>(undefined);

    return {
        activeFile: derived(combined([files, activePath]), ([project, path]) =>
            project.find((file) => file.path === path),
        ),
        activePath,
        consoleOpen: grain(false),
        diagnostics: grain<PlaygroundDiagnostic[]>([]),
        files,
        layout: grain<EditorLayout>('stacked'),
        preview: grain(''),
        previewEvents: grain<PreviewEvent[]>([]),
        status: grain(''),
    };
};

export type ControllerState = ReturnType<typeof createControllerState>;
