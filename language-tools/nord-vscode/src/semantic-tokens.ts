import ts from 'typescript';
import * as vscode from 'vscode';

/**
 * ENHANCED VERSION: Better handling of nested templates and method chains
 */

const tokenTypes = [
    'keyword', // html, css, if, switch
    'function', // Component names
    'variable', // Variables
    'property', // Object properties
    'comment', // Comments
    'string', // String literals
    'number', // Numbers
    'operator', // Operators
    'punctuation', // Brackets
    'type', // Type names
    'htmlTag', // HTML tags
    'htmlAttribute', // HTML attributes
];

const tokenModifiers = ['declaration', 'definition', 'readonly', 'static', 'deprecated', 'abstract', 'async'];

export const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);

interface TemplateContext {
    type: 'html' | 'css';
    depth: number;
    startPos: number;
}

interface EncodedToken {
    line: number;
    startChar: number;
    length: number;
    tokenType: number;
    tokenModifiers: number;
}

export class NordSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    private cache: Map<string, vscode.SemanticTokens> = new Map();

    provideDocumentSemanticTokens(document: vscode.TextDocument): vscode.SemanticTokens | null {
        const cacheKey = `${document.uri.toString()}:${document.version}`;
        if (this.cache.has(cacheKey)) {
            // biome-ignore lint/style/noNonNullAssertion: We checked, it's there
            return this.cache.get(cacheKey)!;
        }

        const tokens = this.generateTokens(document);
        this.cache.set(cacheKey, tokens);

        if (this.cache.size > 100) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) this.cache.delete(firstKey);
        }

        return tokens;
    }

    private generateTokens(document: vscode.TextDocument): vscode.SemanticTokens {
        const text = document.getText();
        const encodedTokens: EncodedToken[] = [];
        const scanner = ts.createScanner(ts.ScriptTarget.Latest, true);
        scanner.setText(text);

        const templateStack: TemplateContext[] = [];
        let currentBraceDepth = 0;
        let token = scanner.scan();

        while (token !== ts.SyntaxKind.EndOfFileToken) {
            const start = scanner.getTokenStart();
            const end = scanner.getTokenEnd();
            const tokenText = text.slice(start, end);
            const pos = document.positionAt(start);

            switch (token) {
                // Handle: html`...` or css`...`
                case ts.SyntaxKind.NoSubstitutionTemplateLiteral: {
                    const templateType = this.checkTemplateType(text, start);
                    if (templateType) {
                        const tagLen = templateType.length;
                        encodedTokens.push({
                            line: pos.line,
                            startChar: pos.character - tagLen - 1,
                            length: tagLen,
                            tokenType: 0, // keyword
                            tokenModifiers: 0,
                        });
                        // Highlight backticks
                        encodedTokens.push({
                            line: pos.line,
                            startChar: pos.character - 1,
                            length: 1,
                            tokenType: 8, // punctuation
                            tokenModifiers: 0,
                        });
                        encodedTokens.push({
                            line: pos.line,
                            startChar: pos.character + (end - start) - 1,
                            length: 1,
                            tokenType: 8, // punctuation
                            tokenModifiers: 0,
                        });
                    }
                    break;
                }

                // Handle: html`...${ (start of interpolation)
                case ts.SyntaxKind.TemplateHead: {
                    const templateType = this.checkTemplateType(text, start);
                    if (templateType) {
                        templateStack.push({
                            type: templateType,
                            depth: 0,
                            startPos: start,
                        });

                        const tagLen = templateType.length;
                        encodedTokens.push({
                            line: pos.line,
                            startChar: pos.character - tagLen - 1,
                            length: tagLen,
                            tokenType: 0, // keyword
                            tokenModifiers: 0,
                        });
                        // Opening backtick
                        encodedTokens.push({
                            line: pos.line,
                            startChar: pos.character - 1,
                            length: 1,
                            tokenType: 8, // punctuation
                            tokenModifiers: 0,
                        });
                    }
                    break;
                }

                // Track brace nesting
                case ts.SyntaxKind.OpenBraceToken: {
                    if (templateStack.length > 0) {
                        currentBraceDepth++;
                        const current = templateStack[templateStack.length - 1];
                        if (current) {
                            current.depth++;
                        }
                    }
                    break;
                }

                // Handle closing braces - might close interpolation
                case ts.SyntaxKind.CloseBraceToken: {
                    if (templateStack.length > 0) {
                        const current = templateStack[templateStack.length - 1];
                        if (current && currentBraceDepth > 0) {
                            currentBraceDepth--;
                            current.depth--;
                        } else if (current && currentBraceDepth === 0) {
                            // Try to rescan as template token
                            token = scanner.reScanTemplateToken(false);
                            const reScanEnd = scanner.getTokenEnd();
                            const reScanPos = document.positionAt(start);

                            if (token === ts.SyntaxKind.TemplateTail) {
                                // Closing backtick
                                encodedTokens.push({
                                    line: reScanPos.line,
                                    startChar: reScanEnd - 1,
                                    length: 1,
                                    tokenType: 8, // punctuation
                                    tokenModifiers: 0,
                                });
                                templateStack.pop();
                                currentBraceDepth = 0;
                                // Continue to next token without re-processing current one
                                token = scanner.scan();
                                continue;
                            }

                            if (token === ts.SyntaxKind.TemplateMiddle) {
                                currentBraceDepth = 0;
                            }
                        }
                    }
                    break;
                }

                // Highlight Nord keywords
                case ts.SyntaxKind.Identifier: {
                    if (this.isNordKeyword(tokenText)) {
                        encodedTokens.push({
                            line: pos.line,
                            startChar: pos.character,
                            length: tokenText.length,
                            tokenType: 0, // keyword
                            tokenModifiers: 0,
                        });
                    }
                    break;
                }

                // Handle .css and .html method chains
                case ts.SyntaxKind.DotToken: {
                    // Look ahead to see if next token is 'css' or 'html'
                    const nextStart = scanner.getTokenEnd();
                    const nextToken = scanner.scan();
                    const nextText = text.slice(scanner.getTokenStart(), scanner.getTokenEnd());

                    if (nextToken === ts.SyntaxKind.Identifier && (nextText === 'css' || nextText === 'html')) {
                        // Highlight the dot
                        encodedTokens.push({
                            line: pos.line,
                            startChar: pos.character,
                            length: 1,
                            tokenType: 8, // punctuation
                            tokenModifiers: 0,
                        });
                        // Highlight the method name
                        const nextPos = document.positionAt(scanner.getTokenStart());
                        encodedTokens.push({
                            line: nextPos.line,
                            startChar: nextPos.character,
                            length: nextText.length,
                            tokenType: 0, // keyword
                            tokenModifiers: 0,
                        });
                    }

                    // Restore scanner position - we've consumed the next token
                    token = nextToken;
                    continue;
                }

                // HTML tag brackets
                case ts.SyntaxKind.LessThanToken: {
                    const currentTemplate = templateStack[templateStack.length - 1];
                    if (currentTemplate && currentTemplate.type === 'html') {
                        encodedTokens.push({
                            line: pos.line,
                            startChar: pos.character,
                            length: 1,
                            tokenType: 8, // punctuation
                            tokenModifiers: 0,
                        });
                    }
                    break;
                }

                case ts.SyntaxKind.GreaterThanToken: {
                    const currentTemplate = templateStack[templateStack.length - 1];
                    if (currentTemplate && currentTemplate.type === 'html') {
                        encodedTokens.push({
                            line: pos.line,
                            startChar: pos.character,
                            length: 1,
                            tokenType: 8, // punctuation
                            tokenModifiers: 0,
                        });
                    }
                    break;
                }
            }

            token = scanner.scan();
        }

        return this.relativeEncode(encodedTokens);
    }

    private checkTemplateType(text: string, start: number): 'html' | 'css' | null {
        // Look backward from template start
        const before = text.slice(Math.max(0, start - 20), start).trim();

        // Direct: html`...`, css`...`
        if (before.endsWith('html')) return 'html';
        if (before.endsWith('css')) return 'css';

        // Method chained: html\`...\`.css\`...\`
        if (before.endsWith('.css')) return 'css';
        if (before.endsWith('.html')) return 'html';

        // Nested in interpolation: `...\${html\`...\`}`
        if (before.match(/html\s*$/)) return 'html';
        if (before.match(/css\s*$/)) return 'css';

        return null;
    }

    private isNordKeyword(text: string): boolean {
        return ['html', 'css', '$if', '$switch', '$each', '$await', 'on', 'mounted', 'ref'].includes(text);
    }

    /**
     * Convert absolute positions to relative encoding for VS Code
     */
    private relativeEncode(tokens: EncodedToken[]): vscode.SemanticTokens {
        // Sort by line, then by position
        tokens.sort((a, b) => {
            if (a.line !== b.line) return a.line - b.line;
            return a.startChar - b.startChar;
        });

        const encoded: number[] = [];
        let prevLine = 0;
        let prevChar = 0;

        for (const token of tokens) {
            const lineDeltas = token.line - prevLine;
            const charDeltas = token.startChar - (token.line === prevLine ? prevChar : 0);

            encoded.push(lineDeltas, charDeltas, token.length, token.tokenType, token.tokenModifiers);

            prevLine = token.line;
            prevChar = token.startChar;
        }

        return new vscode.SemanticTokens(new Uint32Array(encoded));
    }
}
