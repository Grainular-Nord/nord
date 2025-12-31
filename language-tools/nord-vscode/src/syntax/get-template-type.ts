import ts from 'typescript';
import type * as vscode from 'vscode';

export const templateType = { None: 0, Html: 1, Plain: 2 } as const;
export type TemplateType = (typeof templateType)[keyof typeof templateType];

export const getTemplateType = (document: vscode.TextDocument, position: vscode.Position): TemplateType => {
    const text = document.getText();
    const offset = document.offsetAt(position);

    // We utilize the typescript scanner to scan
    // the provided text, to figure out if we are
    // in a tagged template or not.
    const scanner = ts.createScanner(ts.ScriptTarget.Latest, true);
    scanner.setText(text);

    // Stack to track the current type of
    // template, handles nested templates
    // by pushing and popping
    const stack: TemplateType[] = [];
    let currentBraceDepth = 0;

    // Set the current token
    let token = scanner.scan();

    const isTaggedTemplate = (start: number) => {
        return text
            .slice(Math.max(0, start - 10), start)
            .trim()
            .endsWith('html');
    };

    while (token !== ts.SyntaxKind.EndOfFileToken) {
        const start = scanner.getTokenStart();
        const end = scanner.getTokenEnd();

        // If we're past the cursor, we bail early
        if (start >= offset) {
            break;
        }

        // Depending on the token type, we perform different operations.
        // In general, we want to return the respective template type
        // allowing us to check if we're inside a tagged template or not
        switch (token) {
            // Found "`...`" (self contained string)
            // For example, something like: html`something`
            // If our cursor is currently inside, we return it's type
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral: {
                if (offset > start && offset < end) {
                    return isTaggedTemplate(start) ? templateType.Html : templateType.Plain;
                }
                break;
            }

            // Found "` ... ${"
            // (Start of a template with interpolation)
            case ts.SyntaxKind.TemplateHead: {
                // Check tag
                const kind = isTaggedTemplate(start) ? templateType.Html : templateType.Plain;

                stack.push(kind);
                currentBraceDepth = 0; // Reset brace depth for the new code block starting after ${

                // If cursor is inside this head part (e.g. html\` <cursor> ${)
                if (offset > start && offset < end) {
                    return kind;
                }
                break;
            }

            // Found "}" (Closing brace)
            case ts.SyntaxKind.CloseBraceToken: {
                // If we have an active template on stack, we need to check if this } closes the interpolation
                if (stack.length === 0) break;

                // Otherwise, we handle the depth increase
                // and decrease
                if (currentBraceDepth > 0) {
                    currentBraceDepth--;
                } else {
                    // depth is 0, so this '}' closes the ${ ... } block.
                    // We are now back inside the template string.
                    // We must ask TS to re-scan this token as a TemplateMiddle or TemplateTail.
                    token = scanner.reScanTemplateToken(false);
                    const end = scanner.getTokenEnd();

                    // Check if cursor is inside this new template chunk: } ... ${  OR  } ... `
                    if (offset > start && offset < end) {
                        return stack[stack.length - 1] as TemplateType;
                    }

                    // If it's a Tail (` ... `), the template is finished -> Pop stack
                    if (token === ts.SyntaxKind.TemplateTail) {
                        stack.pop();
                    }
                }

                break;
            }

            // Found "{" (Opening brace)
            // We simple increase the current depth
            case ts.SyntaxKind.OpenBraceToken: {
                if (stack.length > 0) {
                    currentBraceDepth++;
                }
                break;
            }

            // Template Middle "} ... ${"  - only happens after reScan
            case ts.SyntaxKind.TemplateMiddle: {
                if (offset > start && offset < end) {
                    return stack[stack.length - 1] as TemplateType;
                }
                currentBraceDepth = 0; // Reset for next interpolation
                break;
            }
        }

        // Set the next token for the iteration
        token = scanner.scan();
    }

    // If we exit the loop, return whatever is on top of the stack (if any)
    return stack.length > 0 ? (stack[stack.length - 1] as TemplateType) : templateType.None;
};
