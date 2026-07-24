import type { AuroraLayoutProps } from '@grainular/aurora';
import { html } from '@grainular/nord';
import { EditorHost, type PlaygroundMeta } from '../components/editor-host';
import { LessonPopover } from '../components/lesson-popover';
import { TutorialNav } from '../components/tutorial-nav';
import { WorkspaceControls } from '../components/workspace-controls';

const lessons = [
    { path: '/01-hello-nord', label: '1. Hello Nørd' },
    { path: '/02-components-and-props', label: '2. Components & Props' },
    { path: '/03-children', label: '3. Children' },
    { path: '/04-grains', label: '4. Grains' },
    { path: '/05-derived-state', label: '5. Derived State' },
    { path: '/06-events', label: '6. Events' },
    { path: '/07-attributes', label: '7. Attributes' },
    { path: '/08-refs', label: '8. Refs' },
    { path: '/09-lifecycle', label: '9. Lifecycle' },
    { path: '/10-custom-directives', label: '10. Custom Directives' },
    { path: '/11-conditional-rendering', label: '11. Conditional Rendering' },
    { path: '/12-lists', label: '12. Lists' },
    { path: '/13-async-rendering', label: '13. Async Rendering' },
];

const Lesson = ({ content, meta }: AuroraLayoutProps) => {
    const playground = (meta as AuroraLayoutProps['meta'] & { playground?: PlaygroundMeta }).playground;

    return html`
        <div class="lesson-layout">
            <div class="lesson-prose">
                ${LessonPopover({ current: meta.title ?? 'Lessons', lessons })}
                <div class="application-content">${content}</div>
                ${meta.links && TutorialNav(meta.links)}
            </div>
            ${playground &&
            EditorHost({ ...playground, controls: { ...playground.controls, reset: true, solve: true } })}
            <div
                class="aurora-component lesson-workspace-controls-host"
                data-aurora-component="WorkspaceControls"
                data-aurora-component-props="%7B%7D"
            >
                ${WorkspaceControls()}
            </div>
        </div>
    `;
};

export default Lesson;
