import type { ResolvedAuroraConfig } from '../config/resolve-config';
import { pluginAuroraCore } from './plugin-aurora-core';
import { pluginAuroraCss } from './plugin-aurora-css';
import { pluginAuroraLlms } from './plugin-aurora-llms';
import { pluginAuroraMarkdown } from './plugin-aurora-markdown';
import { pluginAuroraSearch } from './plugin-aurora-search';
import { pluginAuroraSsg } from './plugin-aurora-ssg';

export const plugin = (config: ResolvedAuroraConfig) => [
    pluginAuroraMarkdown(config),
    pluginAuroraSsg(config),
    pluginAuroraLlms(config),
    pluginAuroraCore(config),
    pluginAuroraSearch(),
    pluginAuroraCss(),
];
