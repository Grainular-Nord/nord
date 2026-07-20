import { createNordEditorEngine, NordEditor } from '@grainular/codemirror';
import '@grainular/codemirror/theme.css';
import './aurora-theme.css';
import { createPlaygroundEditorConfig } from '../../editor-config';
import type { CodeEditorProps } from './types';

const CodeEditor = ({ controls, src, title }: CodeEditorProps) => {
    const engine = createNordEditorEngine(createPlaygroundEditorConfig({ controls, src }));
    return NordEditor({ engine, title });
};

export default CodeEditor;
