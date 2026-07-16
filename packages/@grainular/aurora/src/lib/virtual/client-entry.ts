import { AURORA_CONFIG_ID, AURORA_STYLES_ID } from '../plugin/constants';

export const createClientEntry = (production: boolean) => `
    ${production ? `import ${JSON.stringify(AURORA_STYLES_ID)};` : ''}
    import config from ${JSON.stringify(AURORA_CONFIG_ID)};
    import { activateComponents, builtInComponents } from "@grainular/aurora/runtime";

    const configuredComponents = (config.components ?? []).filter(({ client }) => client);
    activateComponents([...builtInComponents, ...configuredComponents]);
`;
