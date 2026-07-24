import { derived, grain, type WritableGrain } from '@grainular/grains';
import { $each, $if, html, mounted, on } from '@grainular/nord';
import type { EditorFile } from '../core/types';

type Directory = { children: TreeNode[]; kind: 'directory'; name: string; path: string };
type FileNode = { file: EditorFile; kind: 'file'; name: string; path: string };
type TreeNode = Directory | FileNode;

const iconFor = (path: string) => (path.endsWith('.tsx') ? 'TSX' : path.endsWith('.ts') ? 'TS' : 'FILE');

/**
 * File paths are always relative to `src`. Keeping the root out of the file
 * model avoids infecting imports and preview entry points with presentation
 * concerns, while the tree still has a stable project root.
 */
/** Materializes directory nodes from slash-delimited source-relative file paths. */
const projectTree = (files: EditorFile[]): Directory => {
    const root: Directory = { children: [], kind: 'directory', name: 'src', path: '' };
    const directories = new Map<string, Directory>([['', root]]);
    for (const file of files) {
        const parts = file.path.split('/').filter(Boolean);
        const name = parts.pop();
        if (!name) continue;
        let parent = root;
        let path = '';
        for (const part of parts) {
            path = path ? `${path}/${part}` : part;
            let directory = directories.get(path);
            if (!directory) {
                directory = { children: [], kind: 'directory', name: part, path };
                directories.set(path, directory);
                parent.children.push(directory);
            }
            parent = directory;
        }
        parent.children.push({ file, kind: 'file', name, path: file.path });
    }
    const sort = (nodes: TreeNode[]) => {
        nodes.sort((left, right) =>
            left.kind === right.kind ? left.name.localeCompare(right.name) : left.kind === 'directory' ? -1 : 1,
        );
        for (const node of nodes) if (node.kind === 'directory') sort(node.children);
    };
    sort(root.children);
    return root;
};

/**
 * Recursive, source-rooted virtual file tree used by the default workspace.
 * Directory expansion is local UI state keyed by path, independent of file
 * updates, so adding/renaming files does not reset a reader's tree position.
 */
export const EditorProjectTree = ({
    activePath,
    files,
    onAdd,
    onDelete,
    onRename,
}: {
    activePath: WritableGrain<string | undefined>;
    files: WritableGrain<EditorFile[]>;
    onAdd: (name: string) => void;
    onDelete: (path: string) => void;
    onRename: (path: string, name: string) => boolean;
}) => {
    const open = grain(true);
    const isCreating = grain(false);
    const renamingPath = grain<string | undefined>(undefined);
    const directories = new Map<string, WritableGrain<boolean>>();
    // Keep this list unkeyed: the `src` root has a stable empty path, and a
    // keyed root would otherwise reuse its pre-load empty children forever.
    const tree = derived(files, (project) => [projectTree(project)]);
    const hasMultipleFiles = derived(files, (project) => project.length > 1);
    const selected = (path: string) => derived(activePath, (current) => current === path);
    const isRenaming = (path: string) => derived(renamingPath, (current) => current === path);
    const collapsed = (path: string) => {
        const existing = directories.get(path);
        if (existing) return existing;
        const state = grain(false);
        directories.set(path, state);
        return state;
    };
    const renameInput = (path: string) =>
        mounted((host) => {
            if (!(host instanceof HTMLInputElement)) return () => {};
            host.focus();
            host.select();
            let shouldSave = true;
            const finish = () => {
                if (shouldSave) onRename(path, host.value);
                renamingPath.set(undefined);
            };
            const keydown = (event: KeyboardEvent) => {
                if (event.key === 'Enter') finish();
                if (event.key === 'Escape') {
                    shouldSave = false;
                    renamingPath.set(undefined);
                }
            };
            host.addEventListener('keydown', keydown);
            host.addEventListener('blur', finish, { once: true });
            return () => host.removeEventListener('keydown', keydown);
        });
    const newFileInput = mounted((host) => {
        if (!(host instanceof HTMLInputElement)) return () => {};
        host.focus();
        const keydown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                onAdd(host.value);
                isCreating.set(false);
            }
            if (event.key === 'Escape') isCreating.set(false);
        };
        host.addEventListener('keydown', keydown);
        host.addEventListener('blur', () => isCreating.set(false), { once: true });
        return () => host.removeEventListener('keydown', keydown);
    });

    const TreeItem = (node: TreeNode) => {
        if (node.kind === 'directory') {
            const isCollapsed = collapsed(node.path);
            return html`<li data-grainular-editor="directory" data-collapsed="${isCollapsed}">
                <button
                    data-grainular-editor="directory-row"
                    type="button"
                    aria-expanded="${!isCollapsed}"
                    ${on('click', () => isCollapsed.update((value) => !value))}
                >
                    <span data-grainular-editor="tree-chevron" aria-hidden="true">›</span>
                    <svg
                        data-grainular-editor="directory-icon"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path
                            d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
                        />
                    </svg>
                    <span>${node.name}</span>
                </button>
                <ul data-collapsed="${isCollapsed}">
                    ${$each(() => node.children).$as(TreeItem)}
                </ul>
            </li>`;
        }
        const { file } = node;
        return html`<li data-grainular-editor="file-row" data-active="${selected(file.path)}">
            <button
                data-grainular-editor="file"
                type="button"
                title="${file.path}"
                ${on('click', () => activePath.set(file.path))}
            >
                <span data-grainular-editor="file-icon" aria-hidden="true">${iconFor(file.path)}</span>
                ${$if(isRenaming(file.path))
                    .$then(
                        () =>
                            html`<input
                                data-grainular-editor="file-rename"
                                value="${file.path}"
                                aria-label="Rename ${file.path}"
                                ${renameInput(file.path)}
                            />`,
                    )
                    .$else(() => html`<span>${node.name}</span>`)}
            </button>
            ${$if(isRenaming(file.path))
                .$then(() => html``)
                .$else(
                    () => html`<div data-grainular-editor="file-actions">
                        <button
                            type="button"
                            aria-label="Rename ${file.path}"
                            title="Rename file"
                            ${on('click', () => renamingPath.set(file.path))}
                        >
                            ↳
                        </button>
                        ${$if(hasMultipleFiles).$then(
                            () =>
                                html`<button
                                    type="button"
                                    aria-label="Delete ${file.path}"
                                    title="Delete file"
                                    ${on('click', () => onDelete(file.path))}
                                >
                                    ×
                                </button>`,
                        )}
                    </div>`,
                )}
        </li>`;
    };

    return html`<aside data-grainular-editor="project-tree" data-open="${open}" aria-label="Project files">
        <header>
            <button
                data-grainular-editor="project-tree-toggle"
                type="button"
                aria-label="Toggle project files"
                title="Toggle project files"
                aria-pressed="${open}"
                ${on('click', () => open.update((value) => !value))}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M9 3v18" />
                </svg>
            </button>
            <span>Files</span>
            <button
                data-grainular-editor="project-tree-add"
                type="button"
                aria-label="New file"
                title="New file"
                ${on('click', () => isCreating.set(true))}
            >
                +
            </button>
        </header>
        <ul>
            ${$if(isCreating).$then(
                () =>
                    html`<li>
                        <input
                            data-grainular-editor="file-new"
                            type="text"
                            placeholder="dir/file.ts"
                            spellcheck="false"
                            autocomplete="off"
                            aria-label="New file name"
                            ${newFileInput}
                        />
                    </li>`,
            )}${$each(tree).$as(TreeItem)}
        </ul>
    </aside>`;
};
