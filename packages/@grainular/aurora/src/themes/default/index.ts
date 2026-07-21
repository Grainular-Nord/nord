import runtime from '../../runtime/styles';
import base from './base.css?inline';
import markdown from './markdown.css?inline';
import tokens from './tokens.css?inline';

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
