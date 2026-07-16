import type { Rollup } from 'vite';

export const generatedHtmlPages = (bundle: Rollup.OutputBundle) =>
    Object.values(bundle).flatMap((output) => {
        if (output.type !== 'asset' || !output.fileName.endsWith('.html') || output.fileName === '404.html') return [];

        const file = output.fileName.replace(/(?:^|\/)index\.html$/, '');
        const source = typeof output.source === 'string' ? output.source : new TextDecoder().decode(output.source);
        return [{ path: file ? `/${file}` : '/', source }];
    });
