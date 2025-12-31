import * as vscode from 'vscode';

export const getStartCharacter = (
    document: vscode.TextDocument,
    position: vscode.Position,
): [charBeforeCursor: string, charBeforeWord: string] => {
    const range = document.getWordRangeAtPosition(position);
    const wordStart = range ? range.start : position;

    return [
        document.getText(new vscode.Range(position.translate(0, -1), position)),
        wordStart.character > 0 ? document.getText(new vscode.Range(wordStart.translate(0, -1), wordStart)) : '',
    ];
};
