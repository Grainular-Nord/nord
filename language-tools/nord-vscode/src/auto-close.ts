import * as vscode from 'vscode';
import { getAutoClosingTag } from './core/closing-tag';

export const autoCloseHtmlTag = async (event: vscode.TextDocumentChangeEvent) => {
    const editor = vscode.window.activeTextEditor;
    const change = event.contentChanges[0];
    if (!editor || editor.document !== event.document || event.contentChanges.length !== 1 || change?.text !== '>')
        return;

    const offset = change.rangeOffset + 1;
    const closingTag = getAutoClosingTag(event.document.getText(), offset);
    if (!closingTag) return;

    const insertAt = event.document.positionAt(offset);
    const inserted = await editor.edit((builder) => builder.insert(insertAt, closingTag), {
        undoStopBefore: false,
        undoStopAfter: false,
    });
    if (inserted) editor.selection = new vscode.Selection(insertAt, insertAt);
};
