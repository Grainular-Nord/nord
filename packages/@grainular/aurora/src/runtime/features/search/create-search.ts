import type { AuroraSearchEntry } from '../../../lib/config/config';

export type SearchResult = AuroraSearchEntry & {
    excerpt: string;
    score: number;
};

type SearchFeatureOptions = {
    base: string;
    index: string;
};

const normalize = (value: string) =>
    value
        .normalize('NFKD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase();

const createExcerpt = (text: string, query: string) => {
    const normalizedText = normalize(text);
    const match = normalizedText.indexOf(query);
    const start = Math.max(0, match < 0 ? 0 : match - 55);
    const end = Math.min(text.length, start + 150);
    return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
};

const matchEntries = (entries: AuroraSearchEntry[], value: string): SearchResult[] => {
    const query = normalize(value.trim());
    if (!query) return [];
    const terms = query.split(/\s+/);

    return entries
        .map((entry) => {
            const title = normalize(entry.title);
            const section = normalize(entry.section ?? '');
            const text = normalize(entry.text);
            const searchable = `${title} ${section} ${text}`;
            if (!terms.every((term) => searchable.includes(term))) return undefined;

            let score = 0;
            if (title === query) score += 120;
            else if (title.startsWith(query)) score += 80;
            else if (title.includes(query)) score += 55;
            if (section === query) score += 70;
            else if (section.startsWith(query)) score += 45;
            else if (section.includes(query)) score += 30;
            if (text.includes(query)) score += 10;

            return { ...entry, excerpt: createExcerpt(entry.text, query), score };
        })
        .filter((entry): entry is SearchResult => Boolean(entry))
        .sort((left, right) => right.score - left.score)
        .slice(0, 8);
};

export const createSearch = ({ base, index }: SearchFeatureOptions) => {
    let entries: AuroraSearchEntry[] | undefined;
    let request: Promise<AuroraSearchEntry[]> | undefined;

    const load = () => {
        if (entries) return Promise.resolve(entries);
        if (!request) {
            request = fetch(index)
                .then((response) => {
                    if (!response.ok) throw new Error(`Search index request failed with ${response.status}`);
                    return response.json() as Promise<AuroraSearchEntry[]>;
                })
                .then((value) => (entries = value));
        }
        return request;
    };

    return {
        get loaded() {
            return Boolean(entries);
        },
        load,
        find: async (value: string) => matchEntries(await load(), value),
        href: (entry: AuroraSearchEntry) => `${base}${entry.path === '/' ? '' : entry.path.slice(1)}${entry.anchor}`,
    };
};
