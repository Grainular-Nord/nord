import type { TemplateCreatorFn } from '../templates';

export const app = (): TemplateCreatorFn => {
    return async () => {
        return [
            'import { html, on } from "@grainular/nord";',
            'import { grain } from "@grainular/grains";',
            'import "./app.css"',
            '',
            'export const App = () => {',
            '    const count = grain(0);',
            '',
            '   const increment = () => {',
            '       count.set(count() + 1);',
            '   }',
            '',
            '   return html`',
            '       <button ${on("click", increment)}>',
            '           ${count}',
            '       </button>`',
            '}',
        ];
    };
};
