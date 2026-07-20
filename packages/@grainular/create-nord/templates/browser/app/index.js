import { html, mount } from 'http://unpkg.com/@grainular/nord';
import { Logo } from './logo.js';

const App = () => {
    return html`
        <div class="scaffold">
            <div class="glow glow-a"></div>
            <div class="glow glow-b"></div>

            <div class="content">
                ${Logo()}

                <p class="hint">
                    <span class="prompt">$</span> edit
                    <span class="file">app/index.js</span>
                    to get started<span class="cursor"></span>
                </p>

                <div class="links">
                    <a href="https://nordjs.dev" target="_blank" rel="noreferrer">docs</a>
                    <a href="https://github.com/grainular/nord" target="_blank" rel="noreferrer">github</a>
                </div>
            </div>
        </div>
    `;
};

mount(App, { to: document.querySelector('#app') });
