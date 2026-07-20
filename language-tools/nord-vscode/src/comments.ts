import * as vscode from 'vscode';
import { getHtmlCommentEdit } from './core/html-comment';

export const toggleHtmlComment = async (editor: vscode.TextEditor) => {
    const { document, selection } = editor;
    const source = document.getText();
    const start = document.offsetAt(selection.start);
    const end = document.offsetAt(selection.end);

    let edit = getHtmlCommentEdit(source, start, end);
    if (selection.isEmpty && edit?.replacement === '<!--  -->') {
        const line = document.lineAt(selection.active.line);
        const leadingWhitespace = line.text.length - line.text.trimStart().length;
        const trailingWhitespace = line.text.length - line.text.trimEnd().length;
        const lineStart = document.offsetAt(line.range.start) + leadingWhitespace;
        const lineEnd = document.offsetAt(line.range.end) - trailingWhitespace;
        if (lineStart < lineEnd) edit = getHtmlCommentEdit(source, lineStart, lineEnd);
    }

    if (!edit) {
        await vscode.commands.executeCommand('editor.action.commentLine');
        return;
    }

    const range = new vscode.Range(document.positionAt(edit.start), document.positionAt(edit.end));
    const applied = await editor.edit((builder) => builder.replace(range, edit.replacement));
    if (!applied) return;

    const cursor = document.positionAt(edit.cursor);
    editor.selection = new vscode.Selection(cursor, cursor);
};
