import { JSDOM } from 'jsdom';

export const setup = () => {
    const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', { pretendToBeVisual: true });

    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    globalThis.document = dom.window.document as unknown as Document;

    // jsdom exposes this constructor at runtime.
    globalThis.Node = dom.window.Node as any;
    // jsdom exposes this constructor at runtime.
    globalThis.MutationObserver = dom.window.MutationObserver as any;
    // jsdom exposes this constructor at runtime.
    globalThis.HTMLElement = dom.window.HTMLElement as any;
    globalThis.DocumentFragment = dom.window.DocumentFragment;
    globalThis.Element = dom.window.Element;
    globalThis.Comment = dom.window.Comment;
    globalThis.Text = dom.window.Text;
    globalThis.NodeFilter = dom.window.NodeFilter;
    globalThis.MutationObserver = dom.window.MutationObserver;

    return dom;
};
