/** @format */

export const toPascalCase = (strings: TemplateStringsArray, ...values: string[]): string => {
    const fullString = strings.reduce((result, str, i) => result + str + (values[i] || ''), '');
    return fullString
        .split(/[^a-zA-Z0-9]/) // Split by non-alphanumeric characters
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Convert each word to PascalCase
        .join(''); // Join the words back together
};
