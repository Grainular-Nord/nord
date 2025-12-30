export class CustomElementStyles {
    #sheets: CSSStyleSheet[] = [];
    constructor(styles: string[] = []) {
        for (const style of styles) {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(style);
            this.#sheets.push(sheet);
        }
    }

    attach(target: Element | ShadowRoot) {
        const styleRoot = target instanceof ShadowRoot ? target : (target.getRootNode() as Document);

        if ('adoptedStyleSheets' in styleRoot && this.#sheets.length > 0) {
            styleRoot.adoptedStyleSheets = [
                ...styleRoot.adoptedStyleSheets,
                ...this.#sheets.filter((sheet) => {
                    return !styleRoot.adoptedStyleSheets.includes(sheet);
                }),
            ];
        }
    }
}
