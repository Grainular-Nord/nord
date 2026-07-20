export type CodeEditorControls = {
    download?: boolean;
    format?: boolean;
    reset?: boolean;
    share?: boolean;
    solve?: boolean;
};

export type CodeEditorProps = { controls?: CodeEditorControls; src: string; title?: string };
