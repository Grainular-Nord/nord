import type { AuroraLayoutProps } from '@grainular/aurora';
import { html } from '@grainular/nord';

const Landing = ({ content }: AuroraLayoutProps) => html`
    <main class="application-content aurora-landing-content">${content}</main>
`;

export default Landing;
