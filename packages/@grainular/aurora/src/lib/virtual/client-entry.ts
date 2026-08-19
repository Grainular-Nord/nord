import type { AuroraComponentDefinition, AuroraSlots } from '../config/config';
import type { ResolvedAuroraConfig } from '../config/resolve-config';
import { AURORA_STYLES_ID } from '../plugin/constants';

const importPattern = /(?:import|__vite_ssr_dynamic_import__)\(\s*["'`]([^"'`]+)["'`]\s*\)/;

const componentImport = (definition: AuroraComponentDefinition) => {
    const moduleId = definition.component.toString().match(importPattern)?.[1];
    if (!moduleId) {
        throw new Error(`Client component ${definition.name} must be loaded with a direct dynamic import.`);
    }

    return `{
        name: ${JSON.stringify(definition.name)},
        client: true,
        ${definition.host ? `host: ${JSON.stringify(definition.host)},` : ''}
        component: () => import(${JSON.stringify(moduleId)})
    }`;
};

const namedSlots = (slots: AuroraSlots | undefined, namespace: string): AuroraComponentDefinition[] =>
    Object.entries(slots ?? {}).map(([name, definition]) => ({ ...definition, name: `${namespace}:${name}` }));

const clientComponents = (config: ResolvedAuroraConfig) =>
    [
        ...(config.components ?? []),
        ...(config.layouts ?? []).flatMap((layout) => namedSlots(layout.slots, layout.name)),
        ...namedSlots(config.slots, 'app'),
    ]
        .filter((definition) => definition.client)
        .map(componentImport)
        .join(',\n');

export const createClientEntry = (config: ResolvedAuroraConfig, production: boolean) => `
    ${production ? `import ${JSON.stringify(AURORA_STYLES_ID)};` : ''}
    import { activateComponents, builtInComponents } from "@grainular/aurora/runtime";

    const configuredComponents = [${clientComponents(config)}];

    activateComponents([...builtInComponents, ...configuredComponents]);
`;
