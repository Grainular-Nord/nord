import * as vscode from 'vscode';
import { getNordHtmlTemplateFoldingRanges } from './core/template-context';

export const provideFoldingRanges = (document: vscode.TextDocument): vscode.FoldingRange[] => {
    return getNordHtmlTemplateFoldingRanges(document.getText()).flatMap((range) => {
        const start = document.positionAt(range.start).line;
        const end = document.positionAt(range.end).line;

        return end > start ? [new vscode.FoldingRange(start, end, vscode.FoldingRangeKind.Region)] : [];
    });
};
