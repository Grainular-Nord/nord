export const outputPath = (fileName: string) => {
    const withoutIndex = fileName.replace(/(?:^|\/)index\.html$/, '');
    return withoutIndex ? `/${withoutIndex}` : '/';
};
