export const escapeHtmlString = (str: string) => {
    let template = str;
    template = template.replaceAll('`', '\\`');
    template = template.replaceAll('${', '\\${');

    return template;
};
