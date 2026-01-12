import type { TemplateCreatorFn } from '../templates';

export const viteConfig = (): TemplateCreatorFn => {
    return async ({ additionalDependencies }) => {
        if (!additionalDependencies.flat().find(({ name }) => name.includes('tailwindcss'))) {
            return [];
        }

        return [
            'import tailwindcss from "@tailwindcss/vite";',
            'import { defineConfig } from "vite"',
            '',
            'export default defineConfig({',
            '   plugins: [tailwindcss()]',
            '});',
        ];
    };
};
