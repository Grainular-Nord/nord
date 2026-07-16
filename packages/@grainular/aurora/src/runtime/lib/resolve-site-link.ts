export const resolveSiteLink = (link: string, base: string) => {
    if (!link.startsWith('/')) return link;
    return `${base}${link.slice(1)}`;
};
