import type { LlmsPage } from './llms-page';

export const createLlmsFull = (pages: LlmsPage[]) => `${pages.map((page) => page.content).join('\n\n---\n\n')}\n`;
