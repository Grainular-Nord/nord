import estree from 'prettier/plugins/estree';
import html from 'prettier/plugins/html';
import typescript from 'prettier/plugins/typescript';
import prettier from 'prettier/standalone';
import options from '../../prettier.config';

export const formatTypeScript = (source: string) =>
    prettier.format(source, { ...options, parser: 'typescript', plugins: [estree, html, typescript] });
