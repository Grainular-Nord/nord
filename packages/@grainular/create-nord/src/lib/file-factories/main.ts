import type { TemplateCreatorFn } from '../templates';

export const main =
    (type: 'ts' | 'js'): TemplateCreatorFn =>
    async () => {
        return [
            'import { mount } from "@grainular/nord";',
            `import { App } from "./app.${type}";`,
            '',
            'mount(App, { to: document.querySelector("#app") })',
        ];
    };
