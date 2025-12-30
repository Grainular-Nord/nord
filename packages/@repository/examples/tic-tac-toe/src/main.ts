// mount(App, { to: document.querySelector('#app') });

import { css, html, mount, on, withScopedStyles } from '@grainular/core';
import { grain } from '@grainular/grains';

const Counter = ({ label }: { label: string }) => {
    const count = grain(0);

    return html`<button ${on('click', () => count.set(count() + 1))}>${label} ${count}</button>`;
};

const CounterStyles = css`& {color: pink; background: red}`;

const ScopedCounter = withScopedStyles(Counter, CounterStyles);

const App = () => {
    return html`
    <div>${ScopedCounter({ label: 'Test' })}<div>
    <div>${ScopedCounter({ label: 'Test 4' })}<div>
    <div>${ScopedCounter({ label: 'Test 12' })}<div>
    <div>${ScopedCounter({ label: 'Test 1' })}<div>
    <div>${ScopedCounter({ label: 'Test 12' })}<div>    
    <button>Not red?</button>`;
};

mount(App, { to: document.querySelector('#app') });
