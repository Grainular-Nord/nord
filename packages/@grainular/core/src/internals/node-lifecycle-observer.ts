const mounts = new WeakMap<Node, () => void | (() => void)>();
const unmounts = new WeakMap<Node, () => void>();

const runMount = (n: Node) => {
    if (mounts.has(n)) {
        const cleanup = mounts.get(n)?.();
        if (cleanup) {
            unmounts.set(n, cleanup);
        }
    }
};

const runUnmount = (n: Node) => {
    unmounts.get(n)?.();
    unmounts.delete(n);
};

export const nodeLifecycleObserver = {
    observe: (root: Node) => {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                // Handle and check for unmounted nodes
                for (const node of Array.from(mutation.removedNodes)) {
                    // check the root node for any listeners that
                    // need to be cleaned up.
                    runUnmount(node);

                    // Then we check all child nodes for potential cleanup
                    const walker = document.createTreeWalker(node, NodeFilter.SHOW_COMMENT + NodeFilter.SHOW_ELEMENT);
                    while (walker.nextNode()) {
                        runUnmount(walker.currentNode);
                    }
                }

                // Handle and check mounted nodes
                for (const node of Array.from(mutation.addedNodes)) {
                    runMount(node);

                    const walker = document.createTreeWalker(node, NodeFilter.SHOW_COMMENT + NodeFilter.SHOW_ELEMENT);
                    while (walker.nextNode()) {
                        runMount(walker.currentNode);
                    }
                }
            }
        });

        observer.observe(root, { childList: true, subtree: true });
    },
    trackMount: (node: Node, fn: () => void | (() => void)) => {
        mounts.set(node, fn);
    },
    trackUnmount: (node: Node, fn: () => void) => {
        unmounts.set(node, fn);
    },
};
