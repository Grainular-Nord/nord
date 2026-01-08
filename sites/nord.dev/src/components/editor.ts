import { bind } from '@grainular/forms';
import type { WritableGrain } from '@grainular/grains';
import { $each, type ComponentFragment, html } from '@grainular/nord';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';

// biome-ignore format: simple associative list
const tokenMap = new Map<string, string>([['keyword', 'kwd'],['function', 'fn'],['string', 'str'],['punctuation', 'punc'],['operator', 'op'],['number', 'num'],['class-name', 'fn'],['builtin', 'kwd'],['comment', 'comment']]);

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
<pre>
<code>${$each(() => token).$as((token) => {
        return renderToken(token);
    })}
</code>
</pre>
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

    return html`
        <div class="editor">
            ${Highlight({
                code: snippet.trim(),
                tokens: { COUNT: boundInput },
            })}
        </div>
    `;
};
