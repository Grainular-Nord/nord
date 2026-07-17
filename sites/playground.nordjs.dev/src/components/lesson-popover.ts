import { $each, html, on } from '@grainular/nord';
import './lesson-popover.css';

export type LessonLink = { label: string; path: string };
type PopoverElement = HTMLElement & { hidePopover: () => void };

const close = (event: Event) =>
    ((event.currentTarget as HTMLElement).closest('[popover]') as PopoverElement)?.hidePopover();

export const LessonPopover = ({ current, lessons }: { current: string; lessons: LessonLink[] }) => html`
    <div class="lesson-popover">
        <button type="button" class="lesson-popover-trigger" popovertarget="playground-lessons">
            ${current}
        </button>
        <nav id="playground-lessons" class="lesson-popover-panel" popover="auto" aria-label="Lessons">
            ${$each(() => lessons)
                .$withKey((lesson) => lesson.path)
                .$as((lesson) => html`<a href="${lesson.path}" ${on('click', close)}>${lesson.label}</a>`)}
        </nav>
    </div>
`;
