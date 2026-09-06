export const getPathParamGroup = (result: URLPatternResult | null) => {
    return Object.fromEntries(
        Object.entries(result?.pathname?.groups ?? {}).filter(([, value]) => {
            return value !== undefined;
        }),
    ) as Record<string, string>;
};
