const observedNodes = new WeakMap<Node, () => void>();

const runUnsubscribe = (n: Node) => {
    observedNodes.get(n)?.();
    observedNodes.delete(n);
};

export const deletionObserver = {
    observe: (root: Node) => {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of Array.from(mutation.removedNodes)) {
                    // check the root node for any listeners that
                    // need to be cleaned up.
                    runUnsubscribe(node);

                    // Then we check all child nodes for potential cleanup
                    const walker = document.createTreeWalker(node, NodeFilter.SHOW_COMMENT + NodeFilter.SHOW_ELEMENT);
                    while (walker.nextNode()) {
                        runUnsubscribe(walker.currentNode);
                    }
                }
            }
        });

        return observer.observe(root, { childList: true, subtree: true });
    },
    track: (node: Node, cleanup: () => void) => {
        observedNodes.set(node, cleanup);
    },
};
