export type AuroraCommand = 'build' | 'dev' | 'preview';

export type CliArguments = {
    command: AuroraCommand;
    root: string;
    mode?: string;
    host?: string | boolean;
    port?: number;
    open?: boolean;
};

const commands = new Set<AuroraCommand>(['build', 'dev', 'preview']);

const readValue = (arguments_: string[], index: number, option: string) => {
    const value = arguments_[index + 1];
    if (!value || value.startsWith('-')) throw new Error(`${option} requires a value.`);
    return value;
};

export const parseArguments = (arguments_: string[]): CliArguments => {
    const [commandValue = 'dev', ...values] = arguments_;
    if (!commands.has(commandValue as AuroraCommand)) {
        throw new Error(`Unknown Aurora command: ${commandValue}. Expected dev, build, or preview.`);
    }

    const parsed: CliArguments = { command: commandValue as AuroraCommand, root: process.cwd() };
    for (let index = 0; index < values.length; index += 1) {
        const value = values[index];
        if (!value) continue;

        if (value === '--host') {
            const next = values[index + 1];
            if (!next || next.startsWith('-')) parsed.host = true;
            else {
                parsed.host = next;
                index += 1;
            }
        } else if (value === '--port') {
            parsed.port = Number(readValue(values, index, '--port'));
            if (!Number.isInteger(parsed.port)) throw new Error('--port must be an integer.');
            index += 1;
        } else if (value === '--mode') {
            parsed.mode = readValue(values, index, '--mode');
            index += 1;
        } else if (value === '--open') parsed.open = true;
        else if (value.startsWith('-')) throw new Error(`Unknown Aurora option: ${value}`);
        else parsed.root = value;
    }

    return parsed;
};
