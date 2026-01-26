/**
 * A lifecycle observer instance that extends the standard
 * DOM mutation observer. The lifecycle observer is used
 * to register, track and execute lifecycle events on
 * DOM nodes.
 *
 * This allows for efficient cleanup of retaining elements,
 * as well as integration of external libraries or listeners
 */
export const lifecycleObserver = new (
    typeof MutationObserver !== 'undefined'
        ? class LifecycleObserver extends MutationObserver {
              #mounts = new WeakMap<Node, Set<() => void | (() => void)>>();
              #unmounts = new WeakMap<Node, Set<() => void>>();

              #options: MutationObserverInit = {
                  childList: true,
                  attributes: false,
                  subtree: true,
              };

              constructor() {
                  super((mutations) => {
                      for (const { addedNodes, removedNodes } of mutations) {
                          this.#checkMutationRecordsForUnmounts(removedNodes);
                          this.#checkMutationRecordForMounts(addedNodes);
                      }
                  });
              }

              #getWalker(node: Node) {
                  const filter = NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_TEXT + NodeFilter.SHOW_COMMENT;
                  return document.createTreeWalker(node, filter, null);
              }

              #checkMutationRecordsForUnmounts(nodes: NodeList) {
                  // We need to collect pending unmount tasks as:
                  // Not micro tasking them will kill performance
                  // micro tasking them individually will kill performance,
                  // just not as much. This way, we can batch the execution
                  // in a single microtask, after all nodes
                  // have been removed, and call the respective
                  // cleanup functions
                  const pendingUnmounts = new Map<Node, Set<() => void>>();
                  for (const node of nodes) {
                      this.#collectUnmount(node, pendingUnmounts);

                      const tw = this.#getWalker(node);
                      while (tw.nextNode()) {
                          this.#collectUnmount(tw.currentNode, pendingUnmounts);
                      }
                  }

                  if (pendingUnmounts.size > 0) {
                      queueMicrotask(() => {
                          for (const [node, callbacks] of pendingUnmounts) {
                              if (!node.isConnected) {
                                  for (const fn of callbacks) {
                                      fn();
                                  }
                              }
                          }
                      });
                  }
              }

              #collectUnmount(node: Node, pendingUnmounts: Map<Node, Set<() => void>>) {
                  const callbacks = this.#unmounts.get(node);
                  if (callbacks) {
                      pendingUnmounts.set(node, callbacks);
                      this.#unmounts.delete(node);
                  }
              }

              #checkMutationRecordForMounts(nodes: NodeList) {
                  for (const node of nodes) {
                      this.#runMount(node);

                      const tw = this.#getWalker(node);
                      while (tw.nextNode()) {
                          this.#runMount(tw.currentNode);
                      }
                  }
              }

              #runMount(node: Node) {
                  const callbacks = this.#mounts.get(node);
                  if (!callbacks) return;

                  const cleanups = [...callbacks].map((cb) => cb());
                  this.#unmounts.set(
                      node,
                      new Set([...(this.#unmounts.get(node) ?? []), ...cleanups.filter((cb) => !!cb)]),
                  );
              }

              start(node: Node) {
                  this.observe(node, this.#options);
              }

              trackUnmount(node: Node, callback: () => void) {
                  this.#unmounts.set(node, new Set([...(this.#unmounts.get(node) ?? []), callback]));
              }

              trackMount(node: Node, callback: () => void | (() => void)) {
                  this.#mounts.set(node, new Set([...(this.#mounts.get(node) ?? []), callback]));
              }

              unmountNodes(nodes: Node[]) {
                  const pendingUnmounts = new Map<Node, Set<() => void>>();

                  for (const node of nodes) {
                      this.#collectUnmount(node, pendingUnmounts);

                      const tw = this.#getWalker(node);
                      while (tw.nextNode()) {
                          this.#collectUnmount(tw.currentNode, pendingUnmounts);
                      }
                  }

                  if (pendingUnmounts.size > 0) {
                      queueMicrotask(() => {
                          for (const [node, callbacks] of pendingUnmounts) {
                              if (!node.isConnected) {
                                  for (const fn of callbacks) {
                                      fn();
                                  }
                              }
                          }
                      });
                  }
              }
          }
        : class {
              start(_node: Node) {}
              trackUnmount(_node: Node, _callback: () => void) {}
              trackMount(_node: Node, _callback: () => void | (() => void)) {}
              unmountNodes(_nodes: Node[]) {}
              disconnect() {}
          }
)();

export const disconnectNodes = (nodes: Element[]) => {
    lifecycleObserver.unmountNodes(nodes);
    for (const node of nodes) node.remove();
};
