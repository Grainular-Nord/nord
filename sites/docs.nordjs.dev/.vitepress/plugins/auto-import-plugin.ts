import type MarkdownIt from 'markdown-it';
import type Renderer from 'markdown-it/lib/renderer';
import type Token from 'markdown-it/lib/token';

interface MarkdownEnv {
    isInManualSwitch?: boolean;
    switchSlot?: 'package' | 'cdn';
    [key: string]: unknown;
}

export const autoImportPlugin = (md: unknown): void => {
    const processor = md as MarkdownIt;

    const defaultFence =
        processor.renderer.rules.fence ||
        ((tokens: Token[], idx: number, options: MarkdownIt.Options, _env: unknown, self: Renderer) => {
            return self.renderToken(tokens, idx, options);
        });

    processor.renderer.rules.fence = (
        tokens: Token[],
        index: number,
        options: unknown,
        env: unknown,
        self: Renderer,
    ) => {
        const opts = options as MarkdownIt.Options;
        const token = tokens[index];
        if (!token) return defaultFence(tokens, index, opts, env, self);

        const environment = env as MarkdownEnv;
        const codeContent = token.content;

        // Helper to replace imports
        const replaceImports = (code: string) =>
            code.replace(/(['"])@grainular\/([^'"]+)\1/g, '$1https://unpkg.com/@grainular/$2$1');

        // --- CASE A: Inside Manual Switch ---
        if (environment.isInManualSwitch) {
            // 1. Package Slot: Render exactly as written (no changes)
            if (environment.switchSlot === 'package') {
                return defaultFence(tokens, index, opts, env, self);
            }

            // 2. CDN Slot: User wrote JS, but we AUTO-REPLACE the imports for convenience
            if (environment.switchSlot === 'cdn') {
                if (codeContent.includes('@grainular/')) {
                    const cdnContent = replaceImports(codeContent);

                    // Clone token to render modified content
                    const cdnToken = Object.assign({}, token);
                    cdnToken.content = cdnContent;

                    const newTokens = [...tokens];
                    newTokens[index] = cdnToken as Token;
                    return defaultFence(newTokens, index, opts, env, self);
                }
                return defaultFence(tokens, index, opts, env, self);
            }
        }

        // --- CASE B: Standalone Block (Auto-Generate Wrapper) ---

        // Only process if it contains the target package
        if (!codeContent.includes('@grainular/')) {
            return defaultFence(tokens, index, opts, env, self);
        }

        // 1. Render Original (Package)
        const packageHtml = defaultFence(tokens, index, opts, env, self);

        // 2. Generate CDN Version (Text Replacement Only)
        const cdnContent = replaceImports(codeContent);

        const cdnToken = Object.assign({}, token);
        cdnToken.content = cdnContent;
        // Update language for highlighter preference
        cdnToken.info = token.info.replace(/\bts\b/, 'js').replace(/\btypescript\b/, 'javascript');

        const cdnTokens = [...tokens];
        cdnTokens[index] = cdnToken as Token;

        const cdnHtml = defaultFence(cdnTokens, index, opts, env, self);

        // 3. Return Wrapper
        return `
      <CodePreferenceSwitch>
        <template #package>${packageHtml}</template>
        <template #cdn>${cdnHtml}</template>
      </CodePreferenceSwitch>
    `;
    };
};
