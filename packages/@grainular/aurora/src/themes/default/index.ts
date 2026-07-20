import runtime from '../../runtime/styles';
import base from './base.css' with { type: 'text' };
import markdown from './markdown.css' with { type: 'text' };
import tokens from './tokens.css' with { type: 'text' };

export default `
@layer aurora.tokens, aurora.base, aurora.content, aurora.components, aurora.overrides;

@layer aurora.tokens {
    ${tokens}
}

@layer aurora.base {
    ${base}
}

@layer aurora.content {
    ${markdown}
}

@layer aurora.components {
    ${runtime}
}
`;
