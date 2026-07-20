let formatter: Promise<typeof import('./prettier')> | undefined;

const getFormatter = () => {
    if (!formatter) formatter = import('./prettier');
    return formatter;
};

export const formatTypeScript = async (source: string) => (await getFormatter()).formatTypeScript(source);
