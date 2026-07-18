import * as vscode from 'vscode';
import { CONTAINER_HTML_TAGS, VOID_HTML_TAGS } from './core/html-tags';
import { isInNordHtmlTemplate } from './core/template-context';

const elementCompletions = [
    ...VOID_HTML_TAGS.map((tag) => {
        const item = new vscode.CompletionItem(tag, vscode.CompletionItemKind.Snippet);
        item.detail = 'HTML void element';
        item.insertText = new vscode.SnippetString(`${tag}>$0`);
        return item;
    }),
    ...CONTAINER_HTML_TAGS.map((tag) => {
        const item = new vscode.CompletionItem(tag, vscode.CompletionItemKind.Snippet);
        item.detail = 'HTML element';
        item.insertText = new vscode.SnippetString(`${tag}>$0</${tag}>`);
        return item;
    }),
];

export const provideCompletions = (
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.ProviderResult<vscode.CompletionItem[]> => {
    const source = document.getText();
    const offset = document.offsetAt(position);
    if (!isInNordHtmlTemplate(source, offset)) return undefined;

    switch (source[offset - 1]) {
        case '<':
            return elementCompletions;
        default:
            return undefined;
    }
};
