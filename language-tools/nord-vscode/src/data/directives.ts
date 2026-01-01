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
        detail: 'Control Flow',
        insert: new vscode.SnippetString('\\${\\$if($0)}'),
        documentation: new vscode.MarkdownString()
            .appendMarkdown('**Conditionally render a template.**\n\n')
            .appendCodeblock('$if(condition, () => html`...`)', 'typescript')
            .appendMarkdown('\nPass a reactive or static boolean. Can be chained with `.$else()`.\n\n')
            .appendMarkdown('**Usage:**\n')
            .appendCodeblock(
                '${$if(isActive,\n  () => html`<span>Active</span>`)\n  .$else(() => html`<span>Inactive</span>`)\n}',
                'typescript',
            ),
    }),

    // $each struct
    createCompletionItem({
        label: '$each',
        kind: vscode.CompletionItemKind.Function,
        detail: 'Control Flow',
        insert: new vscode.SnippetString('\\${\\$each($0)}'),
        documentation: new vscode.MarkdownString()
            .appendMarkdown('**Iterate over a list.**\n\n')
            .appendCodeblock('$each(list).$as((item, i) => html`...`)', 'typescript')
            .appendMarkdown(
                '\nAccepts a static array or a `Subscribable` array. Requires `.$as()` to define the render template.\n\n',
            )
            .appendMarkdown('**Usage:**\n')
            .appendCodeblock('${$each(items).$as((item) => html`\n  <li>${item}</li>\n`)}', 'typescript'),
    }),

    // $switch struct
    createCompletionItem({
        label: '$switch',
        kind: vscode.CompletionItemKind.Function,
        detail: 'Control Flow',
        insert: new vscode.SnippetString('\\${\\$switch($0)}'),
        documentation: new vscode.MarkdownString()
            .appendMarkdown('**Switch-case logic for templates.**\n\n')
            .appendCodeblock('$switch(value).$case(...).$default(...)', 'typescript')
            .appendMarkdown('\nRenders different templates based on a source value. Must end with `.$default()`.\n\n')
            .appendMarkdown('**Usage:**\n')
            .appendCodeblock(
                "${$switch(status)\n  .$case('loading', () => html`Loading...`)\n  .$case('error', () => html`Error!`)\n  .$default(() => html`Done`)\n}",
                'typescript',
            ),
    }),

    // $await struct
    createCompletionItem({
        label: '$await',
        kind: vscode.CompletionItemKind.Function,
        detail: 'Control Flow',
        insert: new vscode.SnippetString('\\${\\$await($0)}'),
        documentation: new vscode.MarkdownString()
            .appendMarkdown('**Render Promise states.**\n\n')
            .appendCodeblock('$await(promise).$then(...).$catch(...)', 'typescript')
            .appendMarkdown('\nWaits for a promise to resolve and renders the corresponding template.\n\n')
            .appendMarkdown('**Usage:**\n')
            .appendCodeblock(
                '${$await(fetchData)\n  .$then(data => html`<Data val=${data} />`)\n  .$pending(() => html`Loading...`)\n  .$catch(err => html`Error: ${err}`)\n}',
                'typescript',
            ),
    }),

    // $try struct
    createCompletionItem({
        label: '$try',
        kind: vscode.CompletionItemKind.Function,
        detail: 'Control Flow',
        insert: new vscode.SnippetString('\\${\\$try($0)}'),
        documentation: new vscode.MarkdownString()
            .appendMarkdown('**Error Boundary.**\n\n')
            .appendCodeblock('$try(() => html`...`).$catch(...)', 'typescript')
            .appendMarkdown('\nSafely renders a fragment and catches any errors thrown during rendering.\n\n')
            .appendMarkdown('**Usage:**\n')
            .appendCodeblock(
                '${$try(() => html`<UnsafeComponent />`)\n  .$catch(err => html`<div>Failed: ${err}</div>`)\n}',
                'typescript',
            ),
    }),

    // $suspend struct
    createCompletionItem({
        label: '$suspend', // Fixed typo: label was previously '$await'
        kind: vscode.CompletionItemKind.Function,
        detail: 'Control Flow',
        insert: new vscode.SnippetString('\\${\\$suspend($0)}'),
        documentation: new vscode.MarkdownString()
            .appendMarkdown('**Async Component Wrapper.**\n\n')
            .appendCodeblock('$suspend(() => Promise<Fragment>, options)', 'typescript')
            .appendMarkdown('\nHelper to await a component fragment with built-in pending and error states.\n\n')
            .appendMarkdown('**Usage:**\n')
            .appendCodeblock(
                "${$suspend(\n  () => import('./my-cmp').then(m => m.MyCmp()),\n  { pending: () => html`Loading...`,\n    error: (e) => html`Error` }\n)}",
                'typescript',
            ),
    }),

    // $render
    createCompletionItem({
        label: '$render',
        kind: vscode.CompletionItemKind.Function,
        detail: 'Control Flow',
        insert: new vscode.SnippetString('\\${\\$render($0)}'),
        documentation: new vscode.MarkdownString()
            .appendMarkdown('**Render a reactive fragment.**\n\n')
            .appendCodeblock('$render(Subscribable<Fragment>)', 'typescript')
            .appendMarkdown('\nDynamically renders a fragment from a reactive source.\n\n')
            .appendMarkdown('**Usage:**\n')
            .appendCodeblock('${$render(currentView$)}', 'typescript'),
    }),

    // $unsafeHtml
    createCompletionItem({
        label: '$unsafeHtml',
        kind: vscode.CompletionItemKind.Function,
        detail: 'Control Flow',
        insert: new vscode.SnippetString('\\${\\$unsafeHtml($0)}'),
        documentation: new vscode.MarkdownString()
            .appendMarkdown('**Inject raw HTML strings.**\n\n')
            .appendCodeblock('$unsafeHtml(string)', 'typescript')
            .appendMarkdown('\n⚠️ **DANGER:** Only use with trusted content. Never use with user-generated input.\n\n')
            .appendMarkdown('**Usage:**\n')
            .appendCodeblock('${$unsafeHtml(blogPostContent)}', 'typescript'),
    }),
];
