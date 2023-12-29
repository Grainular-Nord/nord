/** @format */

export const isolateTextNodes = (textContent: string, tokens: string[]): Text[] => {
    const nodes: Text[] = [];
    let remainingText = textContent ?? '';

    tokens.forEach((token) => {
        let start = remainingText.indexOf(token);
        while (start !== -1) {
            // Add text before the token, if any
            if (start > 0) {
                nodes.push(document.createTextNode(remainingText.substring(0, start)));
            }

            // Add the token
            nodes.push(document.createTextNode(token));

            // Update the remaining text
            remainingText = remainingText.substring(start + token.length);
            start = remainingText.indexOf(token);
        }
    });

    // Add any remaining text as a node, if any
    if (remainingText.length > 0) {
        nodes.push(document.createTextNode(remainingText));
    }

    return nodes;
};
