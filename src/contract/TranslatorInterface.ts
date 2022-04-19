export type TranslateResult = {
    word: string;
    meanings: Array<string>;
    examples: Array<string>;
}

export interface TranslatorInterface {
    readTranslate(word: string): Promise<TranslateResult | null>
}