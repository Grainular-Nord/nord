import { html, type PropsWithChildren } from '@grainular/nord';

type CalloutProps = PropsWithChildren<{ title?: string }>;
type CalloutVariant = 'note' | 'tip' | 'important' | 'warning' | 'caution';

const createCallout =
    (variant: CalloutVariant, defaultTitle: string) =>
    ({ children, title = defaultTitle }: CalloutProps) =>
        html`
        <div class="aurora-callout aurora-callout-${variant}" role="note" aria-label="${title}">
            <div class="aurora-callout-title">${title}</div>
            <div class="aurora-callout-content">${children}</div>
        </div>
    `;

export const Note = createCallout('note', 'Note');
export const Tip = createCallout('tip', 'Tip');
export const Important = createCallout('important', 'Important');
export const Warning = createCallout('warning', 'Warning');
export const Caution = createCallout('caution', 'Caution');
