export const iterateNodes = (root: Node, work: (node: Element | Comment) => void) => {
    const shouldProcess = (n: Node): n is Element | Comment => n.nodeType === 1 || n.nodeType === 8;

    if (shouldProcess(root)) {
        work(root);
    }

    let current: Node | null = root.firstChild;
    while (current) {
        if (shouldProcess(current)) {
            work(current);
        }

        if (current.firstChild) {
            current = current.firstChild;
            continue;
        }

        // Climb back up until a nextSibling is found or root is reached
        while (current && current !== root) {
            if (current.nextSibling) {
                current = current.nextSibling;
                break;
            }
            current = current.parentNode;
        }

        if (current === root) {
            return;
        }
    }
};
