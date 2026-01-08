import { bind } from '@grainular/forms';
import { type WritableGrain, grain } from '@grainular/grains';
import { $each, $if, type ComponentFragment, html, on } from '@grainular/nord';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';

// biome-ignore format: simple associative list
const tokenMap = new Map<string, string>([['keyword', 'keyword'],['function', 'function'],['string', 'string'],['punctuation', 'punctuation'],['operator', 'operator'],['number', 'number'],['class-name', 'function'],['builtin', 'keyword'],['comment', 'comment']]);

// --- Highlighting ---
//
// The highlight component is used to parse our provided snippet string
// into a tokenized HTML string.
// we can insert content based on provided substitution tokens,
// allowing us to inject reactive fragments directly into the
// tokenized code, which we can then simply render recursively

const Highlight = ({ code, tokens }: { code: string; tokens: Record<string, ComponentFragment> }) => {
    const token = Prism.tokenize(code, Prism.languages.typescript);

    const renderToken = (token: Prism.Token | string): ComponentFragment => {
        // if its a real token, we wrap the content and return it
        if (token instanceof Prism.Token) {
            // If it's one of our tokens, we directly return the associated fragment
            if (typeof token.content === 'string' && token.content in tokens) {
                return tokens[token.content];
            }

            const cls = tokenMap.get(token.type) ?? 'txt';
            if (typeof token.content === 'string') {
                return html`<span class="${cls}">${token.content}</span>`;
            }

            return html`${$each(() => token.content as Array<Prism.Token>).$as((token): ComponentFragment => {
                return renderToken(token);
            })}`;
        }

        // Otherwise, we return the token directly as fragment
        return html`${token}`;
    };

    // We have to indent this weirdly, as we're using a template
    // string, which preserves whitespace inside code and pre
    // tags. Looks stupid but works.
    return html`
<pre><code>${$each(() => token).$as((token) => {
        return renderToken(token);
    })}
</code></pre>
    `;
};

// The snippet to render. This is our
// standard counter example, that we inject
// a live updating node into. This allows
// to demonstrate the deep reactivity
// that characterizes nord.
const snippet = `
import { html } from "@grainular/nord";
import { grain } from "@grainular/grains";

export const Counter = () => {
  const count = grain(COUNT); 

  const increment = () => {
     count.set(count() + 1);
  }

  return html\`
    <button \${on('click', increment)}>
      \${count}
    </button>\`
}
`;

/**
 * The editor component receives the count `Grain`, allowing to access
 * and update the count value defined elsewhere reactively. This will
 * sync the reactive bound input as well as the output button directly.
 * @param param0
 */
export const Editor = ({ count }: { count: WritableGrain<number> }) => {
    // As fragments are just objects, we can easily create a fragment here
    // and pass it as prop to the Highlight component
    const boundInput = html`<input type="number" class="live-input" ${bind(count, 'input')}/>`;

    const copied = grain(false);
    const copy = () => {
        copied.set(true);
        navigator.clipboard.writeText(snippet.replace('COUNT', '0'));
        window.setTimeout(() => copied.set(false), 2500);
    };

    return html`
        <div class="editor">
            <button class="icon-btn copy" ${on('click', copy)} disabled="${copied}">
                ${$if(copied, () => html`copied!`).$else(() => html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`)}
                
            </button>
            ${Highlight({
                code: snippet.trim(),
                tokens: { COUNT: boundInput },
            })}
        </div>
    `;
};
