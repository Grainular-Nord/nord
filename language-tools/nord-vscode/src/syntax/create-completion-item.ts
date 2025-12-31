import * as vscode from 'vscode';

export type NordCompletionItemDescription = {
    label: string;
    kind: vscode.CompletionItemKind;
    detail: string;
    insert: vscode.SnippetString;
    command?: { command: string; title: string };
    documentation?: vscode.MarkdownString;
};

export const createCompletionItem = (details: NordCompletionItemDescription): vscode.CompletionItem => {
    const { label, kind, ...props } = details;
    const item = new vscode.CompletionItem(label, kind);
    item.detail = props.detail;
    item.documentation = props.documentation;
    item.command = props.command;
    item.insertText = props.insert;

    return item;
};
