import type { ThemeRegistration } from 'shiki';

interface SyntaxPalette {
    background: string;
    foreground: string;
    muted: string;
    comment: string;
    blue: string;
    cyan: string;
    mint: string;
    violet: string;
    rose: string;
}

const rule = (scope: string[], foreground: string, fontStyle?: 'bold' | 'italic') => ({
    scope,
    settings: { foreground, ...(fontStyle ? { fontStyle } : {}) },
});

const createAuroraTheme = (name: string, type: 'light' | 'dark', palette: SyntaxPalette): ThemeRegistration => ({
    name,
    type,
    fg: palette.foreground,
    bg: palette.background,
    colors: {
        'editor.background': palette.background,
        'editor.foreground': palette.foreground,
    },
    settings: [
        { settings: { foreground: palette.foreground, background: palette.background } },
        rule(['comment', 'punctuation.definition.comment'], palette.comment, 'italic'),
        rule(
            [
                'keyword',
                'storage.type',
                'storage.modifier',
                'variable.other.property',
                'meta.object-literal.key',
                'support.variable.property',
                'entity.name.tag',
            ],
            palette.blue,
        ),
        rule(
            ['keyword.operator', 'punctuation.accessor', 'punctuation.separator', 'punctuation', 'meta.brace'],
            palette.muted,
        ),
        rule(
            [
                'string',
                'constant.other.symbol',
                'entity.other.inherited-class',
                'markup.inserted',
                'meta.diff.header.to-file',
            ],
            palette.mint,
        ),
        rule(
            [
                'constant.numeric',
                'constant.language',
                'support.constant',
                'entity.name.type',
                'entity.name.class',
                'support.type',
                'support.class',
            ],
            palette.violet,
        ),
        rule(
            [
                'constant.character.escape',
                'string.regexp',
                'entity.name.function',
                'support.function',
                'meta.function-call',
                'entity.other.attribute-name',
            ],
            palette.cyan,
        ),
        rule(['variable.parameter'], palette.foreground, 'italic'),
        rule(['markup.heading', 'markup.bold'], palette.blue, 'bold'),
        rule(['markup.italic'], palette.cyan, 'italic'),
        rule(['markup.deleted', 'meta.diff.header.from-file', 'invalid', 'invalid.illegal'], palette.rose),
    ],
});

export const auroraLightTheme = createAuroraTheme('aurora-light', 'light', {
    background: '#f1f4f8',
    foreground: '#263244',
    muted: '#59677c',
    comment: '#5d697c',
    blue: '#0866bd',
    cyan: '#006f82',
    mint: '#317545',
    violet: '#7855b8',
    rose: '#b43b62',
});

export const auroraDarkTheme = createAuroraTheme('aurora-dark', 'dark', {
    background: '#090d13',
    foreground: '#cbd5e3',
    muted: '#8290a5',
    comment: '#718097',
    blue: '#67adff',
    cyan: '#74d7e8',
    mint: '#9bd6a8',
    violet: '#c0a4ff',
    rose: '#ff7e9f',
});
