export const lifecycleObserver = new (
    typeof MutationObserver !== 'undefined'
        ? class LifecycleObserver extends MutationObserver {
              // We add all callbacks to the mounting queue, and
              // on trigger check if any of the nodes are connected.
              // if yes, the callbacks get executed and the return
              // added to the unmounts
              #pendingMounts = new Set<{ node: Node; callback: () => void | (() => void) }>();

              // On trigger, we check all nodes in the map if they are
              // still mounted, and if not, run the unmount callback
              #activeUnmounts = new Map<Node, Set<() => void>>();

              constructor() {
                  // We abuse the mutation observer as basically
                  // a signal, triggering our lifecycle logic iteration
                  super(() => {
                      this.#processLifecycle();
                  });
              }

              #processLifecycle() {
                  for (const entry of this.#pendingMounts) {
                      const { node, callback } = entry;

                      // When connected, we run the callback, remove the
                      // entry, and add any eventual cleanup to the
                      // unmounts map
                      if (node.isConnected) {
                          const cleanup = callback();

                          // If it returned a cleanup, register it
                          if (typeof cleanup === 'function') {
                              let unmounts = this.#activeUnmounts.get(node);
                              if (!unmounts) {
                                  unmounts = new Set();
                                  this.#activeUnmounts.set(node, unmounts);
                              }
                              unmounts.add(cleanup);
                          }

                          // Remove from pending list (Job Done)
                          this.#pendingMounts.delete(entry);
                      }
                  }

                  // Same for the unmounting entries, we iterate them
                  // and execute every unmounting cb where the node is disconnected
                  for (const [node, callbacks] of this.#activeUnmounts) {
                      if (!node.isConnected) {
                          for (const fn of callbacks) fn();
                          this.#activeUnmounts.delete(node);
                      }
                  }
              }

              start(node: Node) {
                  this.observe(node, { childList: true, subtree: true });
              }

              trackMount(node: Node, callback: () => void | (() => void)) {
                  this.#pendingMounts.add({ node, callback });
              }

              trackUnmount(node: Node, callback: () => void) {
                  let unmounts = this.#activeUnmounts.get(node);
                  if (!unmounts) {
                      unmounts = new Set();
                      this.#activeUnmounts.set(node, unmounts);
                  }
                  unmounts.add(callback);
              }
          }
        : class {
              start() {}
              trackUnmount() {}
              trackMount() {}
          }
)();

export const disconnectNodes = (nodes: Element[]) => {
    for (const node of nodes) node.remove();
};
