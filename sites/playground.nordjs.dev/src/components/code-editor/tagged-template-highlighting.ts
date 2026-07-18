import { syntaxTree } from '@codemirror/language';
import { RangeSetBuilder } from '@codemirror/state';
import { Decoration, type DecorationSet, EditorView, ViewPlugin, type ViewUpdate } from '@codemirror/view';

const taggedTemplate = Decoration.mark({ class: 'cm-nord-template-tag' });
const templateText = Decoration.mark({ class: 'cm-nord-template-text' });
const elementName = Decoration.mark({ class: 'cm-nord-template-element' });
const attributeName = Decoration.mark({ class: 'cm-nord-template-attribute' });
const attributeValue = Decoration.mark({ class: 'cm-nord-template-value' });
const interpolationBoundary = Decoration.mark({ class: 'cm-nord-template-interpolation' });
const interpolationCallable = Decoration.mark({ class: 'cm-nord-template-callable' });
const interpolationOperator = Decoration.mark({ class: 'cm-nord-template-operator' });
const constantDefinition = Decoration.mark({ class: 'cm-nord-definition-constant' });
const functionDefinition = Decoration.mark({ class: 'cm-nord-definition-function' });

type TemplateDecoration = { from: number; to: number; decoration: Decoration };

const collectDecorations = (view: EditorView, templateTags: ReadonlySet<string>) => {
    const decorations: TemplateDecoration[] = [];
    const templateRanges: { from: number; to: number }[] = [];
    syntaxTree(view.state).iterate({
        enter: (node) => {
            if (node.name !== 'TaggedTemplateExpression') return;

            const tag = node.node.firstChild;
            const template = node.node.getChild('TemplateString');
            if (!tag || !template || !templateTags.has(view.state.sliceDoc(tag.from, tag.to))) return;
            templateRanges.push({ from: template.from, to: template.to });
            decorations.push({ from: tag.from, to: tag.to, decoration: taggedTemplate });

            let textStart = template.from + 1;
            for (const interpolation of template.getChildren('Interpolation')) {
                if (textStart < interpolation.from)
                    decorations.push({ from: textStart, to: interpolation.from, decoration: templateText });
                textStart = interpolation.to;
            }
            if (textStart < template.to - 1)
                decorations.push({ from: textStart, to: template.to - 1, decoration: templateText });

            const source = view.state.sliceDoc(template.from, template.to);
            const markup = /<\/?([\w-]+)(?:\s+([^<>]*?))?\s*\/?>/g;
            for (const match of source.matchAll(markup)) {
                const matchStart = template.from + (match.index ?? 0);
                const name = match[1];
                if (!name) continue;
                const nameStart = matchStart + match[0].indexOf(name);
                decorations.push({ from: nameStart, to: nameStart + name.length, decoration: elementName });

                const attributes = match[2];
                if (!attributes) continue;
                const attributesStart = matchStart + match[0].indexOf(attributes);
                for (const attribute of attributes.matchAll(/([\w:-]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/g)) {
                    const name = attribute[1];
                    if (!name) continue;
                    const attributeStart = attributesStart + (attribute.index ?? 0);
                    decorations.push({
                        from: attributeStart,
                        to: attributeStart + name.length,
                        decoration: attributeName,
                    });
                    const value = attribute[2];
                    if (!value) continue;
                    const valueStart = attributeStart + attribute[0].lastIndexOf(value);
                    decorations.push({ from: valueStart, to: valueStart + value.length, decoration: attributeValue });
                }
            }
        },
    });

    const isInTemplate = (from: number, to: number) =>
        templateRanges.some((range) => range.from <= from && to <= range.to);
    syntaxTree(view.state).iterate({
        enter: (node) => {
            if (node.name === 'VariableDefinition') {
                const declaration = node.node.parent;
                const initializer = declaration && view.state.sliceDoc(node.to, declaration.to);
                const decoration =
                    initializer && /^\s*=\s*(?:async\s*)?(?:\([^)]*\)|[\w$]+)\s*=>/.test(initializer)
                        ? functionDefinition
                        : constantDefinition;
                decorations.push({ from: node.from, to: node.to, decoration });
                return;
            }
            if (!isInTemplate(node.from, node.to)) return;

            if (node.name === 'InterpolationStart' || node.name === 'InterpolationEnd') {
                decorations.push({ from: node.from, to: node.to, decoration: interpolationBoundary });
            } else if (node.name === 'Arrow' || node.name === 'ArithOp' || node.name === 'Equals') {
                decorations.push({ from: node.from, to: node.to, decoration: interpolationOperator });
            } else if (node.name === 'VariableName' && node.node.parent?.name === 'CallExpression') {
                decorations.push({ from: node.from, to: node.to, decoration: interpolationCallable });
            } else if (node.name === 'PropertyName' && node.node.parent?.parent?.name === 'CallExpression') {
                decorations.push({ from: node.from, to: node.to, decoration: interpolationCallable });
            }
        },
    });
    return decorations.sort((left, right) => left.from - right.from || left.to - right.to);
};

const buildDecorations = (view: EditorView, templateTags: ReadonlySet<string>): DecorationSet => {
    const builder = new RangeSetBuilder<Decoration>();
    for (const { from, to, decoration } of collectDecorations(view, templateTags)) builder.add(from, to, decoration);
    return builder.finish();
};

/** Adds lightweight markup highlighting inside the configured tagged templates. */
export const taggedTemplateHighlighting = (tags: readonly string[] = ['html', 'svg', 'css']) => {
    const templateTags = new Set(tags);
    return ViewPlugin.fromClass(
        class {
            decorations: DecorationSet;

            constructor(view: EditorView) {
                this.decorations = buildDecorations(view, templateTags);
            }

            update(update: ViewUpdate) {
                if (update.docChanged) this.decorations = buildDecorations(update.view, templateTags);
            }
        },
        { decorations: (plugin) => plugin.decorations },
    );
};
