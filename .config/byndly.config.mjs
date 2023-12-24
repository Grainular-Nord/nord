/**
 * Byndly config - read more: https://github.com/IamSebastianDev/byndly
 *
 * @format
 */

const bootstrap = ({ createComponent, render, grain, createDirective }) => {
    const child = createComponent({
        selector: 'Child',
        template: (html, { name, $children }) => {
            return html`<h3>Hello, ${name}</h3>
                <div class="children">${$children}</div>`;
        },
    });

    const parent = createComponent({
        selector: 'Parent',
        template: (html) => {
            const name = grain('World');

            return html`<div>
                <Child ${{ '@props': { name } }}>
                    <div class="Test">Hello, im child content</div>
                </Child>
                <button ${{ '@click': () => name.set('Sebastian') }}>Change Name</button>
            </div>`;
        },
    });

    render(parent, {
        target: document.querySelector('body'),
    });
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
