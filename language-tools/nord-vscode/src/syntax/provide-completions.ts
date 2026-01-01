import type * as vscode from 'vscode';
import { communications } from '../extension';
import { getStartCharacter } from './get-start-character';
import { getTemplateType, templateType } from './get-template-type';
import { provideHtmlTagSuggestions } from './prodive-html-tag-suggestions';
import { provideDirectiveSuggestions } from './provide-directives-suggestions';

export const provideCompletions = (document: vscode.TextDocument, position: vscode.Position) => {
    // 1. Use the Robust Parser
    const kind = getTemplateType(document, position);

    // If we are not in an HTML template, return nothing.
    if (kind !== templateType.Html) {
        return undefined;
    }

    communications.write(`Inside html template string @ [${position}]`);

    // We extract the start character from
    // the document and cursor position
    const [beforeCursor, beforeWord] = getStartCharacter(document, position);
    switch (beforeCursor) {
        // If the user types a $, he probably want's to
        // start a interpolation, either with a structural
        // directive or direct template expression
        case '$': {
            communications.write('Providing directive completion');
            return provideDirectiveSuggestions();
        }

        // If typing a <, we suggest a list of fitting html
        // tags for completion.
        case '<': {
            communications.write('Providing tag completion');
            return provideHtmlTagSuggestions(beforeWord === '<');
        }
    }
};
