import { AURORA_CONFIG_ID, AURORA_STYLES_ID } from '../plugin/constants';

export const createClientEntry = (production: boolean) => `
    ${production ? `import ${JSON.stringify(AURORA_STYLES_ID)};` : ''}
    import config from ${JSON.stringify(AURORA_CONFIG_ID)};
    import { activateComponents, builtInComponents } from "@grainular/aurora/runtime";

    // Namespacing mirrors the resolution in ssg-entry.ts, so a slot's DOM
    // identifier here matches the one its server-rendered host was given.
    const namedSlots = (definitions, namespace) =>
        Object.entries(definitions ?? {}).map(([key, slot]) => ({ ...slot, name: namespace + ':' + key }));

    const configuredComponents = [
        ...(config.components ?? []),
        ...(config.layouts ?? []).flatMap((layout) => namedSlots(layout.slots, layout.name)),
        ...namedSlots(config.slots, 'app'),
    ].filter(({ client }) => client);

    activateComponents([...builtInComponents, ...configuredComponents]);
`;
