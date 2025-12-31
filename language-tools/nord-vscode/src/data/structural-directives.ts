import * as vscode from 'vscode';
import { createCompletionItem } from '../syntax/create-completion-item';

export const structuralDirectives = [
    // Template Expression insertion short cut
    createCompletionItem({
        label: '${}',
        kind: vscode.CompletionItemKind.Keyword,
        detail: 'Template expression',
        insert: new vscode.SnippetString('\\${ $0 }'),
        command: { command: 'editor.action.triggerSuggest', title: 'Re-trigger suggestions' },
    }),

    // $if struct
    createCompletionItem({
        label: '$if',
        kind: vscode.CompletionItemKind.Function,
        detail: 'Control Flow Expression',
        insert: new vscode.SnippetString('\\${\\$if(${1:condition}).\\$else(2:else)}'),
        documentation: new vscode.MarkdownString('**Control Flow**\n\nUsed to conditionally render templates'),
    }),

    // $each struct
    createCompletionItem({
        label: '$each',
        kind: vscode.CompletionItemKind.Function,
        detail: 'Control Flow Expression',
        insert: new vscode.SnippetString('\\${\\$each(${1:iter}).\\$as()}'),
        documentation: new vscode.MarkdownString(
            '**Control Flow**\n\nCan be used to iterate a static or reactive value',
        ),
    }),
];
