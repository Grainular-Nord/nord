import { html } from '@grainular/nord';
import { CodeMirrorEditor } from './code-mirror';
import { createPlaygroundController } from './playground-controller';
import { PreviewPanel } from './preview-panel';
import { ProjectTabs } from './project-tabs';
import { ResizeHandle } from './resize-handle';
import type { CodeEditorProps } from './types';
import '../code-editor.css';

const CodeEditor = ({ src, title }: CodeEditorProps) => {
    const controller = createPlaygroundController(src);
    return html`<section class="aurora-code-editor" data-layout="${controller.layout}" ${controller.load} aria-label="Interactive code editor">
        ${ProjectTabs({ activePath: controller.activePath, files: controller.files, onAdd: controller.addFile, onDelete: controller.deleteFile })}
        <div class="aurora-code-editor-workspace">
            <div class="aurora-code-editor-code-panel">${CodeMirrorEditor({ diagnostics: controller.diagnostics, file: controller.activeFile, onChange: controller.updateActiveFile, onRun: () => void controller.run() })}</div>
            ${ResizeHandle({ layout: controller.layout })}
            ${PreviewPanel({ consoleOpen: controller.consoleOpen, layout: controller.layout, onRun: () => void controller.run(), preview: controller.preview, previewEvents: controller.previewEvents, session: controller.previewSession, status: controller.status, title })}
        </div>
    </section>`;
};

export default CodeEditor;
