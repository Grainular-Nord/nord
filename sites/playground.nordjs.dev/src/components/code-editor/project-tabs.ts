import { derived, grain, type WritableGrain } from '@grainular/grains';
import { $each, $if, html, mounted, on } from '@grainular/nord';
import type { ProjectFile } from './types';

export const ProjectTabs = ({
    activePath,
    files,
    onAdd,
    onDelete,
}: {
    activePath: WritableGrain<string | undefined>;
    files: WritableGrain<ProjectFile[]>;
    onAdd: (name: string) => void;
    onDelete: (path: string) => void;
}) => {
    const isCreating = grain(false);
    const hasMultipleFiles = derived(files, (project) => project.length > 1);
    const selected = (path: string) => derived(activePath, (current) => current === path);
    const newFileInput = mounted((host) => {
        if (!(host instanceof HTMLInputElement)) return () => {};
        host.focus();
        const onKeydown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                onAdd(host.value);
            }
            if (event.key === 'Escape') {
                event.preventDefault();
                isCreating.set(false);
            }
        };
        const onBlur = () => isCreating.set(false);
        host.addEventListener('keydown', onKeydown);
        host.addEventListener('blur', onBlur);
        return () => {
            host.removeEventListener('keydown', onKeydown);
            host.removeEventListener('blur', onBlur);
        };
    });

    return html`<div class="aurora-code-editor-toolbar">
        <div class="aurora-code-editor-tabs" role="tablist" aria-label="Project files">
            ${$each(files)
                .$withKey((file) => file.path)
                .$as(
                    (file) => html`
                <div class="aurora-code-editor-tab-wrap" role="presentation">
                    <button class="aurora-code-editor-tab" type="button" role="tab" aria-selected="${selected(file.path)}" ${on('click', () => activePath.set(file.path))}>${file.path}</button>
                    ${$if(hasMultipleFiles).$then(
                        () =>
                            html`<button class="aurora-code-editor-tab-delete" type="button" aria-label="Delete ${file.path}" title="Delete file" ${on(
                                'click',
                                (event) => {
                                    event.stopPropagation();
                                    onDelete(file.path);
                                },
                            )}>×</button>`,
                    )}
                </div>`,
                )}
            ${$if(isCreating)
                .$then(
                    () =>
                        html`<input class="aurora-code-editor-new-file-input" type="text" placeholder="file.ts" spellcheck="false" autocomplete="off" aria-label="New file name" ${newFileInput} />`,
                )
                .$else(
                    () =>
                        html`<button class="aurora-code-editor-tab aurora-code-editor-tab-add" type="button" title="New file" aria-label="New file" ${on('click', () => isCreating.set(true))}>+</button>`,
                )}
        </div>
        <span class="aurora-code-editor-language">TypeScript</span>
    </div>`;
};
