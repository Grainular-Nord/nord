import type { Grain } from '@grainular/grains';
import { createDirective } from '@grainular/nord';

type Source = { subscribe: (subscriber: () => void) => () => void };

const HIGHLIGHT_NAME = 'aurora-search';

const collectRanges = (root: Element, terms: string[]) => {
    const ranges: Range[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
        const node = walker.currentNode as Text;
        const text = node.data.toLowerCase();
        for (const term of terms) {
            for (let index = text.indexOf(term); index >= 0; index = text.indexOf(term, index + term.length)) {
                const range = new Range();
                range.setStart(node, index);
                range.setEnd(node, index + term.length);
                ranges.push(range);
            }
        }
    }

    return ranges;
};

/**
 * Highlights the current query terms inside the dialog through the CSS
 * Custom Highlight API — the browser paints ranges over the existing
 * text nodes, so no markup is ever injected. Repaints on a microtask after
 * any of the given sources change, once the DOM has settled; a microtask
 * (rather than `requestAnimationFrame`) still coalesces synchronous updates
 * into one pass but, unlike rAF, isn't gated on the tab actually painting a
 * frame. Does nothing where the API is unavailable.
 */
export const highlightMatches = (query: Grain<string>, ...sources: Source[]) =>
    createDirective((node) => {
        if (!('highlights' in CSS)) return;

        let scheduled = false;
        const paint = () => {
            if (scheduled) return;
            scheduled = true;
            queueMicrotask(() => {
                scheduled = false;
                const terms = query().trim().toLowerCase().split(/\s+/).filter(Boolean);
                if (terms.length === 0) return CSS.highlights.delete(HIGHLIGHT_NAME);
                CSS.highlights.set(HIGHLIGHT_NAME, new Highlight(...collectRanges(node, terms)));
            });
        };

        const subscriptions = [query, ...sources].map((source) => source.subscribe(paint));
        return () => {
            CSS.highlights.delete(HIGHLIGHT_NAME);
            for (const unsubscribe of subscriptions) unsubscribe();
        };
    });
