export const isValidPackageName = (name: string) => {
    return !!name.match(/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/gim);
};
