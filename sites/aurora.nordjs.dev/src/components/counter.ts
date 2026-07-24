import { grain } from '@grainular/grains';
import { html, on } from '@grainular/nord';

type CounterProps = { label?: string };

const Counter = ({ label = 'A live Aurora island' }: CounterProps) => {
    const count = grain(0);

    return html`
        <div class="aurora-island-demo">
            <div>
                <strong>${label}</strong>
                <span>Only this component activates in the browser.</span>
            </div>
            <button type="button" ${on('click', () => count.update((value) => value + 1))}>Count: ${count}</button>
        </div>
    `;
};

export default Counter;
