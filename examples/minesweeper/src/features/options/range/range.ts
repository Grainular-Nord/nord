import { type Control, bind } from '@grainular/forms';
import { derived } from '@grainular/grains';
import { html } from '@grainular/nord';
import './range.css';

type RangeProps = {
    label: string;
    control: Control<number>;
    formatter: (value: number) => string;
    min: number;
    max: number;
};
export const Range = ({ control, label, formatter, min, max }: RangeProps) => {
    const progress = derived(control.value, (v) => ((v - min) / (max - min)) * 100);
    return html`
        <label class="range-field">
            <span class="range-label">${label}</span>
            <div class="range-control">
                <input 
                    type="range" 
                    ${bind(control.value)} 
                    min="${min}" 
                    max="${max}" 
                    style="--progress: ${progress}%"
                />
                <div class="range-value">${derived(control.value, (v) => formatter(v))}</div>
            </div>
        </label>`;
};
