import { type ComponentFragment, html } from '@grainular/nord';

type LandingHeroProps = {
    children?: ComponentFragment;
};

const LandingHero = ({ children }: LandingHeroProps) => html`
    <a class="aurora-landing-brand" href="/" aria-label="Aurora home">
        <img src="/nord-logo.svg" alt="" />
        <span>Aurora</span>
    </a>
    <section class="aurora-hero">
        <div class="aurora-hero-copy">
            <h1>Aurora</h1>
            <p class="aurora-hero-tagline">Static pages, live islands.</p>
            <p class="aurora-hero-summary">Markdown becomes HTML. Nørd wakes up only what needs a browser.</p>
            <a class="aurora-hero-link" href="/getting-started">Read the documentation <span aria-hidden="true">→</span></a>
        </div>

        <div class="aurora-hero-demo" aria-label="Markdown with a live Aurora island">
            <pre aria-label="Aurora Markdown example"><code><span class="aurora-code-key">#</span> Hello, Aurora

This text ships as HTML.

<span class="aurora-code-key">:::Counter</span>
<span class="aurora-code-key">:::</span></code></pre>
            ${children}
        </div>
    </section>
`;

export default LandingHero;
