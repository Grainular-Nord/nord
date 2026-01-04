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
                  for (const node of nodes) {
                      this.#runUnmount(node);

                      const tw = this.#getWalker(node);
                      while (tw.nextNode()) {
                          this.#runUnmount(tw.currentNode);
                      }
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

              #runUnmount(node: Node) {
                  for (const fn of this.#unmounts.get(node) ?? []) {
                      queueMicrotask(() => {
                          !node.isConnected && fn();
                      });
                  }
                  this.#unmounts.delete(node);
              }

              #runMount(node: Node) {
                  const cleanups = [...(this.#mounts.get(node) ?? [])].map((cb) => cb());
                  this.#unmounts.set(
                      node,
                      new Set([...(this.#unmounts.get(node) ?? []), ...cleanups.filter((cb) => !!cb)]),
                  );
              }

              /**
               * Publicly exposed method to start observing a target node
               * using the predefined options.
               *
               * @param node
               */
              start(node: Node) {
                  this.observe(node, this.#options);
              }

              /**
               * Public method to register a unmount callback, that
               * gets executed when the specified node gets removed
               * from the DOM
               *
               * @param node
               * @param callback
               */
              trackUnmount(node: Node, callback: () => void) {
                  this.#unmounts.set(node, new Set([...(this.#unmounts.get(node) ?? []), callback]));
              }

              /**
               * Public method to register a mount callback, that
               * gets executed when the specified node is added to
               * the DOM
               *
               * @param node
               * @param callback
               */
              trackMount(node: Node, callback: () => void | (() => void)) {
                  this.#mounts.set(node, new Set([...(this.#mounts.get(node) ?? []), callback]));
              }

              /**
               * Public method to run unmount callbacks of
               * nodes. This does NOT remove the nodes from
               * the DOM. Use the available `disconnectNodes`
               * fn, to also remove the nodes from the DOM
               *
               * @param nodes
               */
              unmountNodes(nodes: Node[]) {
                  for (const node of nodes) {
                      this.#runUnmount(node);

                      const tw = this.#getWalker(node);
                      while (tw.nextNode()) {
                          this.#runUnmount(tw.currentNode);
                      }
                  }
              }
          }
        : // We provide a noop shim for environments where
          // the mutation observer does not exist. this allows
          // to import the code on a node environment or somewhere
          // else, while keeping the api aligned.
          class {
              start(_node: Node) {}
              trackUnmount(_node: Node, _callback: () => void) {}
              trackMount(_node: Node, _callback: () => void | (() => void)) {}
              unmountNodes(_nodes: Node[]) {}
              disconnect() {}
          }
)();

/**
 * Method to remove a list of nodes from the DOM. The
 * method does also check for and executes and unmounting
 * callbacks stored for the specified node and all children
 *
 * @param nodes
 */
export const disconnectNodes = (nodes: Element[]) => {
    lifecycleObserver.unmountNodes(nodes);
    for (const node of nodes) node.remove();
};
