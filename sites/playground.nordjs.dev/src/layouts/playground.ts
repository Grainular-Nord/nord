import type { AuroraLayoutProps } from '@grainular/aurora';
import { html } from '@grainular/nord';
import { EditorHost, type PlaygroundMeta } from '../components/editor-host';

const Playground = ({ meta }: AuroraLayoutProps) => {
    const playground = (meta as AuroraLayoutProps['meta'] & { playground?: PlaygroundMeta }).playground;

    return html`
        <div class="playground-layout">
            ${playground &&
            EditorHost({ ...playground, controls: { ...playground.controls, download: true, share: true } })}
        </div>
    `;
};

export default Playground;
