import { AURORA_CONFIG_ID } from '../plugin/constants';

export const createComponentModule = (name: string) => `
    import config from ${JSON.stringify(AURORA_CONFIG_ID)};
    import { renderComponentHost } from "@grainular/aurora/runtime";

    const definition = (config.components ?? []).find(({ name }) => name === ${JSON.stringify(name)});
    if (!definition) throw new Error(${JSON.stringify(`Unknown Aurora component: ${name}`)});
    const { default: component } = await definition.component();

    export const ${name} = (props) => renderComponentHost(definition, component, props);
`;
