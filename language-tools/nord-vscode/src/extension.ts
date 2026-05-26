import * as vscode from 'vscode';
import pkg from '../package.json';
import { provideCompletions } from './syntax/provide-completions';
import { output } from './system/output';

export const communications = output();

export function activate(context: vscode.ExtensionContext) {
    communications.write('Extension Activated 🚀');
    communications.write(`Extension is available, v. ${pkg.version}`);

    // 1. Completion provider (existing)
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        ['typescript', 'javascript', 'typescriptreact', 'javascriptreact'],
        {
            provideCompletionItems(document, position) {
                return provideCompletions(document, position);
            },
        },
        '<',
        '$',
    );

    // // 2. Semantic tokens provider (NEW - handles nested templates)
    // const semanticTokensProvider = vscode.languages.registerDocumentSemanticTokensProvider(
    //     ['typescript', 'javascript', 'typescriptreact', 'javascriptreact'],
    //     new NordSemanticTokensProvider(),
    //     legend,
    // );

    context.subscriptions.push(completionProvider);
    communications.write('Semantic tokens provider registered');
}
