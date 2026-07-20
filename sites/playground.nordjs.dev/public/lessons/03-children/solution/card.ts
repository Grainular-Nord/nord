import { html, type PropsWithChildren } from '@grainular/nord';

type CardProps = PropsWithChildren<{ title: string }>;

export const Card = ({ title, children }: CardProps) => html`
    <section class="box">
        <h2>${title}</h2>
        ${children}
    </section>
`;
