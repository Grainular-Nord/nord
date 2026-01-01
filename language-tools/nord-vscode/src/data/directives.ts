import * as vscode from 'vscode';
import { createCompletionItem } from '../syntax/create-completion-item';

export const directives = [
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

    // $unsafeHtml
    createCompletionItem({
        label: '$unsafeHtml',
        kind: vscode.CompletionItemKind.Function,
        detail: 'Control Flow Expression',
        insert: new vscode.SnippetString('\\${\\$unsafeHtml(${1:string})}'),
        documentation: new vscode.MarkdownString(
            '**Control Flow**\n\nCan be used to inject trusted HTML in an unsafe way if required. **DO NOT USE FOR USER GENERATED CODE!**',
        ),
    }),

    // $render
    createCompletionItem({
        label: '$render',
        kind: vscode.CompletionItemKind.Function,
        detail: 'Control Flow Expression',
        insert: new vscode.SnippetString('\\${\\$render(${1:source})}'),
        documentation: new vscode.MarkdownString(
            '**Control Flow**\n\nCan be used to render a reactive template fragment.',
        ),
    }),

    // $switch
    createCompletionItem({
        label: '$switch',
        kind: vscode.CompletionItemKind.Function,
        detail: 'Control Flow Expression',
        insert: new vscode.SnippetString(
            '\\${\\$switch(${1:condition}).\\$case(() => ${2:template}).\\$default(() => ${3:template})}',
        ),
        documentation: new vscode.MarkdownString(
            '**Control Flow**\n\nCan be used to render different templates based on a source value.',
        ),
    }),

    // $await
    createCompletionItem({
        label: '$await',
        kind: vscode.CompletionItemKind.Function,
        detail: 'Control Flow Expression',
        insert: new vscode.SnippetString(
            '\\${\\$await(${1:promise}).\\$then((result) => ${2:template}).\\$pending(() => ${3:template})}',
        ),
        documentation: new vscode.MarkdownString(
            '**Control Flow**\n\nCan be used to await a promise, while rendering a pending template.',
        ),
    }),

    // $suspend
    createCompletionItem({
        label: '$await',
        kind: vscode.CompletionItemKind.Function,
        detail: 'Control Flow Expression',
        insert: new vscode.SnippetString('\\${\\$suspend(() => ${1:promise})}'),
        documentation: new vscode.MarkdownString(
            '**Control Flow**\n\nCan be used to await a promise containing a component fragment.',
        ),
    }),

    // $try
    createCompletionItem({
        label: '$try',
        kind: vscode.CompletionItemKind.Function,
        detail: 'Control Flow Expression',
        insert: new vscode.SnippetString('\\${\\$try(() => ${1:fragment}).\\$catch((error) => ${2:fragment})}'),
        documentation: new vscode.MarkdownString(
            '**Control Flow**\n\nCan be used as error boundary, will invoke the component render fn in a try catch block and relay any error.',
        ),
    }),

    // on
    createCompletionItem({
        label: 'on',
        kind: vscode.CompletionItemKind.Function,
        detail: 'Element Directive',
        insert: new vscode.SnippetString('\\${on(${1:event, () => {}})}'),
        documentation: new vscode.MarkdownString(
            '**Element Directive**\n\nAdds a event listener for a given event to the element.',
        ),
    }),
];
