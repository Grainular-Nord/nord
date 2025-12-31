import * as vscode from 'vscode';
import { provideCompletions } from './syntax/provide-completions';

export function activate(context: vscode.ExtensionContext) {
    const output = vscode.window.createOutputChannel('Nord Framework');
    output.appendLine('Nord Extension Activated 🚀');

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
