const observedNodes = new WeakMap<Node, () => void>()
export const deletionObserver = {
    observe: (root: Node) => {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of Array.from(mutation.removedNodes)) {
                    observedNodes.get(node)?.()
                }
            }
        })

        return observer.observe(root, { childList: true, subtree: true })
    },
    track: (node: Node, cleanup: () => void) => {
        observedNodes.set(node, cleanup)
    },
}
