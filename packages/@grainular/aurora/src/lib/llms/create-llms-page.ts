import type { LlmsPage } from './llms-page';

export const createLlmsPage = (page: LlmsPage): [string, string] => {
    const targetPath = page.path === '/' ? 'index.llms.txt' : `${page.path.slice(1)}/index.llms.txt`;
    return [targetPath, page.content];
};
