import { describe, expect, it } from 'bun:test';
import { Symbols } from '../internals/symbols';
import { createDirective } from './create-directive';
import { isDirective } from './directive';

describe('Directives', () => {
    // We first want to see if our directive is
    // correctly created and tagged as directive.
    it('Marks the provided handler as Directive', () => {
        const directive = createDirective(() => {});

        // Our assert fn should correctly assert the
        // directive as directive
        expect(isDirective(directive)).toBe(true);

        // And the symbol should exist in the directive.
        expect(Symbols.DIRECTIVE in directive).toBe(true);
    });
});
