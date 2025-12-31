import type * as vscode from 'vscode';
import { getStartCharacter } from './get-start-character';
import { getTemplateType, templateType } from './get-template-type';
import { provideHtmlTagSuggestions } from './prodive-html-tag-suggestions';
import { provideStructuralDirectives } from './provide-structural-directives';

export const provideCompletions = (document: vscode.TextDocument, position: vscode.Position) => {
    // 1. Use the Robust Parser
    const kind = getTemplateType(document, position);

    // If we are not in an HTML template, return nothing.
    if (kind !== templateType.Html) {
        return undefined;
    }

    // We extract the start character from
    // the document and cursor position
    const [beforeCursor, beforeWord] = getStartCharacter(document, position);
    switch (beforeCursor) {
        // If the user types a $, he probably want's to
        // start a interpolation, either with a structural
        // directive or direct template expression
        case '$': {
            return provideStructuralDirectives();
        }

        // If typing a <, we suggest a list of fitting html
        // tags for completion.
        case '<': {
            return provideHtmlTagSuggestions(beforeWord === '<');
        }
    }
};
