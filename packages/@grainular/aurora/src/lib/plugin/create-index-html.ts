import type { AuroraStaticPage } from '../config/config';
import { escapeHtml } from '../utils/escape-html';

export const createIndexHtml = (entry: string, page: AuroraStaticPage, stylesheets: string[] = []) => {
    const styles = stylesheets
        .map((stylesheet) => `<link rel="stylesheet" href="${stylesheet}" />`)
        .join('\n            ');

    return `<!doctype html>
    <html lang="${escapeHtml(page.language)}">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script>
                (() => {
                    let theme;
                    try { theme = localStorage.getItem('aurora.theme'); } catch {}
                    if (theme !== 'dark' && theme !== 'light') {
                        theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                    }
                    document.documentElement.dataset.theme = theme;
                })();
            </script>
            ${page.head}
            ${styles}
            <script type="module" crossorigin src="${entry}"></script>
        </head>
        <body>
            <div id="app">${page.markup}</div>
        </body>
    </html>`;
};
