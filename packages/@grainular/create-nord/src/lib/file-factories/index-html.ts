import type { TemplateCreatorFn } from '../templates';

export const indexHtml =
    (bundle: string, style: string): TemplateCreatorFn =>
    async ({ name }) => {
        return [
            '<!doctype html>',
            '<html lang="en">',
            '   <head>',
            '       <meta charset="UTF-8" />',
            '       <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
            `       <link rel="stylesheet" href="${style}" />`,
            `       <title>${name} - Nørd</title>`,
            '   </head>',
            '   <body>',
            '       <div id="app"></div>',
            `       <script type="module" src="${bundle}"></script>`,
            '   </body>',
            '</html>',
        ];
    };
