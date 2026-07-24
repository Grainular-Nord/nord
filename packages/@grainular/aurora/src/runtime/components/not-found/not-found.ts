import { type ComponentFragment, html } from '@grainular/nord';

type NotFoundProps = {
    home: string;
    children?: ComponentFragment | null;
};

export const NotFound = ({ home, children }: NotFoundProps) => html`
    <section class="aurora-not-found">
        <div class="aurora-not-found-visual" aria-hidden="true">
            <span>4</span><span class="aurora-not-found-zero">Ø</span><span>4</span>
        </div>
        <div class="aurora-not-found-content">${children}</div>
        <a class="aurora-not-found-home" href=${home}>Return home</a>
    </section>
`;

export const DefaultNotFoundContent = () => html`
    <h1>Lost in the aurora</h1>
    <p>This page drifted beyond the edge of the map.</p>
`;
