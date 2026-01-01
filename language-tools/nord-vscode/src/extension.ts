import * as vscode from 'vscode';
import { provideCompletions } from './syntax/provide-completions';
import { output } from './system/output';

export const communications = output();

export function activate(context: vscode.ExtensionContext) {
    communications.write('Extension Activated 🚀');

    const provider = vscode.languages.registerCompletionItemProvider(
        ['typescript', 'javascript'],
        {
            provideCompletionItems(document, position) {
                return provideCompletions(document, position);
            },
        },
        ...['<', '$'],
    );

    context.subscriptions.push(provider);
}
