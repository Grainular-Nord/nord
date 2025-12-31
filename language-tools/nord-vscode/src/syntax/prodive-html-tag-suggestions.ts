import * as vscode from 'vscode';
import { REGULAR_TAGS, VOID_TAGS } from '../data/tags';
import { createCompletionItem } from './create-completion-item';

export const provideHtmlTagSuggestions = (hasOpenBracket: boolean) => {
    const createItem = (tag: string, snippet: string) => {
        return createCompletionItem({
            label: tag,
            kind: vscode.CompletionItemKind.Snippet,
            detail: 'HTML Tag',
            insert: new vscode.SnippetString(snippet),
        });
    };

    const open = hasOpenBracket ? '' : '<';

    return [
        ...VOID_TAGS.map((tag) => createItem(tag, `${open}${tag} \/>$0`)),
        ...REGULAR_TAGS.map((tag) => createItem(tag, `${open}${tag}>$0</${tag}>`)),
    ];
};
