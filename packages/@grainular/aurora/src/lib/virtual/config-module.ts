import type { ResolvedAuroraConfig } from '../config/resolve-config';

export const createConfigModule = (config: ResolvedAuroraConfig) =>
    config.configFile ? `export { default } from ${JSON.stringify(config.configFile)};` : 'export default {};';
