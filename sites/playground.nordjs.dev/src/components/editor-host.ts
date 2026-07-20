import { html } from '@grainular/nord';
import type { CodeEditorControls } from './code-editor/types';

export type PlaygroundMeta = { controls?: CodeEditorControls; src: string; title?: string };

// The editor is a persistent pane, not markdown content — its config comes
// from frontmatter (`playground:`) rather than an inline `:::CodeEditor`
// directive, so it can be a real structural layout element instead of
// something CSS has to fish out of the flowed content.
export const EditorHost = ({ controls, src, title }: PlaygroundMeta) => {
    const props = encodeURIComponent(JSON.stringify({ controls, src, title }));

    return html`
        <div
            class="aurora-component lesson-editor-host"
            data-aurora-component="CodeEditor"
            data-aurora-component-props="${props}"
        >
            <div class="aurora-code-editor-placeholder">Loading playground…</div>
        </div>
    `;
};
