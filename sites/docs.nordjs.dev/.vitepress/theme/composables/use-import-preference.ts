import { useStorage } from '@vueuse/core';

export type ImportPreference = 'package' | 'cdn';

// defined outside the function to ensure singleton state across components
const preference = useStorage<ImportPreference>('docs.nord.dev-import-preference', 'package');

export function useImportPreference() {
    const toggle = () => {
        preference.value = preference.value === 'package' ? 'cdn' : 'package';
    };

    return {
        preference,
        toggle,
    };
}
