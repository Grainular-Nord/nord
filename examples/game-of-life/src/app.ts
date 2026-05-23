import { html } from '@grainular/nord';
import './app.css';
import { Controls } from './components/controls/controls.component';
import { Grid } from './components/grid/grid.component';
import { Stats } from './components/stats/stats.component';

export const App = () => {
    return html`
        ${Grid()}
        ${Controls()}
        ${Stats()}
    `;
};
