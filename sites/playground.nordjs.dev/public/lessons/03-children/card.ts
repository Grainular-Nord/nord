import { html, type PropsWithChildren } from '@grainular/nord';

type CardProps = PropsWithChildren<{ title: string }>;

// TODO: destructure `children` too, and render it below the heading.
export const Card = ({ title }: CardProps) => html`
    <section class="box">
        <h2>${title}</h2>
    </section>
`;
