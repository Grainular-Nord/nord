import * as vscode from 'vscode';

export const output = () => {
    const output = vscode.window.createOutputChannel('@grainular/nord');

    return {
        write: (...msg: unknown[]) => {
            output.appendLine(`[@grainular/nord] - ${new Date().toLocaleTimeString()} - ${msg}`);
        },
    };
};
