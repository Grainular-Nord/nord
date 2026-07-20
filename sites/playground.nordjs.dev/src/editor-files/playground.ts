import type { EditorFile } from '../../../../packages/@grainular/codemirror/src';

/** The editable project shown by the standalone playground. */
export const playgroundFiles: EditorFile[] = [
    {
        path: 'main.ts',
        contents: `import { grain } from '@grainular/grains';
import { html, mount, on } from '@grainular/nord';

const count = grain(0);

const App = () => html\`
    <main>
        <h1>Playground</h1>
        <p>A live Nørd sandbox — write and run code with no setup.</p>
        <p>Count: \${count}</p>
        <button type="button" \${on('click', () => count.update((current) => current + 1))}>Increment</button>
    </main>
\`;

mount(App, { to: document.querySelector('#app') });
`,
    },
];
