import type { EditorFile } from './types';

const crc32 = (value: Uint8Array) => {
    let crc = 0xffffffff;
    for (const byte of value) {
        crc ^= byte;
        for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
};

const write32 = (view: DataView, offset: number, value: number) => view.setUint32(offset, value, true);
const write16 = (view: DataView, offset: number, value: number) => view.setUint16(offset, value, true);

/** Creates a standards-compliant, store-only ZIP without a runtime dependency. */
export const projectZip = (files: EditorFile[]) => {
    const encoder = new TextEncoder();
    const entries = files.map((file) => ({ contents: encoder.encode(file.contents), name: encoder.encode(file.path) }));
    const localSize = entries.reduce((size, file) => size + 30 + file.name.length + file.contents.length, 0);
    const centralSize = entries.reduce((size, file) => size + 46 + file.name.length, 0);
    const bytes = new Uint8Array(localSize + centralSize + 22);
    const view = new DataView(bytes.buffer);
    let offset = 0;
    const central: Array<{ crc: number; offset: number }> = [];

    for (const file of entries) {
        const crc = crc32(file.contents);
        central.push({ crc, offset });
        write32(view, offset, 0x04034b50);
        write16(view, offset + 4, 20);
        write16(view, offset + 8, 0);
        write32(view, offset + 14, crc);
        write32(view, offset + 18, file.contents.length);
        write32(view, offset + 22, file.contents.length);
        write16(view, offset + 26, file.name.length);
        bytes.set(file.name, offset + 30);
        bytes.set(file.contents, offset + 30 + file.name.length);
        offset += 30 + file.name.length + file.contents.length;
    }
    const centralOffset = offset;
    for (const [index, file] of entries.entries()) {
        const metadata = central[index];
        if (!metadata) continue;
        write32(view, offset, 0x02014b50);
        write16(view, offset + 4, 20);
        write16(view, offset + 6, 20);
        write32(view, offset + 16, metadata.crc);
        write32(view, offset + 20, file.contents.length);
        write32(view, offset + 24, file.contents.length);
        write16(view, offset + 28, file.name.length);
        write32(view, offset + 42, metadata.offset);
        bytes.set(file.name, offset + 46);
        offset += 46 + file.name.length;
    }
    write32(view, offset, 0x06054b50);
    write16(view, offset + 8, entries.length);
    write16(view, offset + 10, entries.length);
    write32(view, offset + 12, centralSize);
    write32(view, offset + 16, centralOffset);
    return new Blob([bytes], { type: 'application/zip' });
};

/** Downloads a virtual project as a ZIP and releases its temporary object URL. */
export const downloadProject = (files: EditorFile[], filename = 'project') => {
    const url = URL.createObjectURL(projectZip(files));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${filename}.zip`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
};
