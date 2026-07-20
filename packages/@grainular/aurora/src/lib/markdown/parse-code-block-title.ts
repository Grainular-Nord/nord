const titlePattern = /(?:^|\s)(?:title|filename)=(?:"([^"]*)"|'([^']*)'|([^\s]+))/;

export const parseCodeBlockTitle = (meta = '') => {
    const match = meta.match(titlePattern);
    return match?.[1] ?? match?.[2] ?? match?.[3];
};
