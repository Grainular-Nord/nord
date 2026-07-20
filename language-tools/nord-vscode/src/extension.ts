import * as vscode from 'vscode';
import { autoCloseHtmlTag } from './auto-close';
import { toggleHtmlComment } from './comments';
import { provideCompletions } from './completions';
import { provideFoldingRanges } from './folding';

const DOCUMENT_SELECTOR: vscode.DocumentSelector = ['javascript', 'javascriptreact', 'typescript', 'typescriptreact'];

export const activate = (context: vscode.ExtensionContext) => {
    const output = vscode.window.createOutputChannel('Nord');
    output.appendLine(`Activated Nord for VS Code v${context.extension.packageJSON.version}.`);
    let loggedFoldingRequest = false;

    context.subscriptions.push(
        output,
        vscode.languages.registerCompletionItemProvider(
            DOCUMENT_SELECTOR,
            {
                provideCompletionItems: provideCompletions,
            },
            '<',
        ),
        vscode.commands.registerTextEditorCommand('nord.toggleHtmlComment', toggleHtmlComment),
        vscode.workspace.onDidChangeTextDocument(autoCloseHtmlTag),
        vscode.languages.registerFoldingRangeProvider(DOCUMENT_SELECTOR, {
            provideFoldingRanges(document) {
                const ranges = provideFoldingRanges(document);
                if (!loggedFoldingRequest) {
                    output.appendLine(`Folding provider returned ${ranges.length} range(s).`);
                    loggedFoldingRequest = true;
                }
                return ranges;
            },
        }),
    );
};

export const deactivate = () => undefined;
