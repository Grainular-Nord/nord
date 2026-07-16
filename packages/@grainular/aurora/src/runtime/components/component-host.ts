import { $unsafeHtml, html } from '@grainular/nord';
import type { AuroraComponentDefinition, AuroraComponentModule } from '../../lib/config/config';
import { isComponentFragment } from '../lib/is-component-fragment';

type SerializedHtml = {
    __auroraHtml: string;
};

type ComponentProps = Record<string, unknown>;
type HostDefinition = Pick<AuroraComponentDefinition, 'client' | 'host' | 'name'>;

const serializeProps = (props: ComponentProps) => {
    const serialized = Object.fromEntries(
        Object.entries(props).map(([key, value]) => {
            if (key === 'children' && isComponentFragment(value)) {
                return [key, { __auroraHtml: value.render() } satisfies SerializedHtml];
            }

            return [key, value];
        }),
    );

    return encodeURIComponent(JSON.stringify(serialized));
};

export const deserializeComponentProps = (serialized: string): ComponentProps => {
    const props = JSON.parse(decodeURIComponent(serialized)) as ComponentProps;
    const children = props.children as SerializedHtml | undefined;

    if (children?.__auroraHtml) props.children = $unsafeHtml(children.__auroraHtml);
    return props;
};

export const renderComponentHost = (
    definition: HostDefinition,
    component: AuroraComponentModule['default'],
    props: ComponentProps,
) => {
    if (!definition.client) return component(props);

    const className = ['aurora-component', definition.host?.class].filter(Boolean).join(' ');
    return html`
        <div
            class="${className}"
            data-aurora-component="${definition.name}"
            data-aurora-component-props="${serializeProps(props)}"
        >
            ${component(props)}
        </div>
    `;
};
