export const disconnectNodes = (nodes: Element[] = []) => {
    for (const node of nodes) node?.remove();
};
