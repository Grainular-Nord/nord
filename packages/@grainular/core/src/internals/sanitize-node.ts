export const sanitizeNode = (node: Node) => {
    // We want to only sanitize element nodes.
    if (node.nodeType !== Node.ELEMENT_NODE || !(node instanceof HTMLElement)) {
        return;
    }

    if (['SCRIPT', 'IFRAME', 'OBJECT', 'EMBED'].includes(node.tagName)) {
        return node.remove();
    }

    for (const attr of Array.from(node.attributes)) {
        if (attr.name.startsWith('on')) {
            node.removeAttribute(attr.name);
        }

        const val = attr.value.trim().toLowerCase();
        if (
            ['src', 'href', 'xlink:href'].includes(attr.name) &&
            (val.startsWith('javascript:') || val.startsWith('data:'))
        ) {
            node.removeAttribute(attr.name);
        }
    }
};
