import { mounted } from '@grainular/nord';
import { createControllerState } from './controller-state';
import { createLessonTools } from './lesson-tools';
import { createPreviewTools } from './preview-tools';
import { createProjectTools } from './project-tools';

export const createPlaygroundController = (src: string) => {
    const state = createControllerState();
    let cancelled = false;

    const preview = createPreviewTools({ isCancelled: () => cancelled, state });
    const projects = createProjectTools({ onChange: preview.scheduleRun, run: preview.run, state });
    const lessons = createLessonTools({ projects, reportError: preview.reportError, run: preview.run, src, state });

    const load = mounted(() => {
        void (async () => {
            try {
                const project = await lessons.formatInitialProject(await projects.loadProject(src));
                if (cancelled || project.length === 0) return;
                projects.setInitialProject(project);
                await projects.applyProject(project);
            } catch {
                if (!cancelled) state.status.set('Failed to load the lesson files.');
            }
        })();
        return () => {
            cancelled = true;
            preview.dispose();
        };
    });

    return { ...state, ...projects, ...preview, ...lessons, load };
};
