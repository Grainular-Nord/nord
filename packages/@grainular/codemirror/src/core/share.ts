// URL serialization for editor projects.
import type { EditorFile, EditorLayout } from './types';

/** Serializable editor state embedded in a share URL fragment. */
type SharedProject = { activePath?: string; files: EditorFile[]; layout?: EditorLayout };
const prefix = 'nord-editor:v1:';

const encode = (value: string) =>
    btoa(unescape(encodeURIComponent(value)))
        .replaceAll('+', '-')
        .replaceAll('/', '_')
        .replaceAll('=', '');
const decode = (value: string) =>
    decodeURIComponent(
        escape(
            atob(
                value
                    .replaceAll('-', '+')
                    .replaceAll('_', '/')
                    .padEnd(Math.ceil(value.length / 4) * 4, '='),
            ),
        ),
    );

/** Encodes project state with a version prefix so later formats can coexist. */
export const serializeProject = (project: SharedProject) => `${prefix}${encode(JSON.stringify(project))}`;

/** Decodes and validates a shared project, returning undefined for malformed links. */
export const deserializeProject = (value: string): SharedProject | undefined => {
    if (!value.startsWith(prefix)) return undefined;
    try {
        const project = JSON.parse(decode(value.slice(prefix.length))) as Partial<SharedProject>;
        if (
            !Array.isArray(project.files) ||
            !project.files.every((file) => typeof file?.path === 'string' && typeof file?.contents === 'string')
        )
            return undefined;
        return { activePath: project.activePath, files: project.files, layout: project.layout };
    } catch {
        return undefined;
    }
};

/** Creates a shareable URL without sending project contents to a server. */
export const projectShareUrl = (project: SharedProject, location = window.location) => {
    const url = new URL(location.href);
    url.hash = `editor=${serializeProject(project)}`;
    return url.toString();
};

/** Reads the editor fragment from a URL created by `projectShareUrl`. */
export const projectFromLocation = (location = window.location) => {
    const params = new URLSearchParams(location.hash.slice(1));
    return deserializeProject(params.get('editor') ?? '');
};
