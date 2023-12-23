/**
 * Byndly config - read more: https://github.com/IamSebastianDev/byndly
 *
 * @format
 */

const bootstrap = ({ createComponent, render, grain }) => {
    // Your bootstrapping code goes here.
    const comp = createComponent({
        selector: 'Test',
        template: (html, { $onMount }) => {
            $onMount(() => {
                console.log('Component Mounted');
            });

            const count = grain(0);
            const increment = () => count.update((c) => c++);

            return html`<button ${{ '@click': () => increment() }}>${count}</button>`;
        },
    });

    render(comp, { target: document.querySelector('body') });
};

/**
 * @type { import("byndly").UserConfig }
 */

export default {
    // indicate that the bundle is a es6 module and needs
    // to be imported to be available
    module: true,
    // the path to the bundle
    bundle: './dist/index.mjs',
    // the bootstrap function
    bootstrap: bootstrap,
    // Reload the browser on changes to the bundle?
    watch: true,
    // Add files to include, like css or external javascript
    include: [],
    // The port to use
    port: 31415,
    // The host to use
    host: 'localhost',
    // Log additional information to the console?
    verbose: false,
    // Silence the console output?
    quiet: false,
    // Set a name for the browser window
    name: 'Nørd Test',
    // A optional template to use
    template: undefined,
};
