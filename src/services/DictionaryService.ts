import axios from "axios";
import { TranslateResult, TranslatorInterface } from "../contract/TranslatorInterface";
import { DictionaryResponse } from "../types/dictionary";
class DictionaryService implements TranslatorInterface {
    async readTranslate(word: string): Promise<TranslateResult> {
        let result = await this.getTranslation(word);

        if (result)
            return this.parseResult(word, result);
        return {
            word: word,
            meanings: [],
            learners: [],
            examples: []
        };
    }

    parseResult(word: string, response: DictionaryResponse): TranslateResult {
        return {
            word: word,
            meanings: this.getMeanings(response),
            learners: this.getLearnersExamples(response),
            examples: this.getExamples(response)
        };
    }

    getExamples(response: DictionaryResponse): Array<string> {
        return response.data.content.examples.map(item => item.sentence)
    }

    getLearnersExamples(response: DictionaryResponse): Array<string> {
        const learners = response.data.content.learners;
        const learnersDefinitions = learners.flatMap(item => item.definitions);
        return [...learnersDefinitions.flatMap(item => item.defs)];
    }

    getMeanings(response: DictionaryResponse): Array<string> {
        if (!response.data.content.luna) {
            return [];
        };
        const definitions = response.data.content.luna.entries;
        let result = [];
        for (let i = 0; i < definitions.length; i++) {
            const posBlocks = definitions[i].posBlocks;
            const definitionBlock = posBlocks.flatMap(item => item.definitions);
            result.push(...definitionBlock.map(def => def.definition));
        }

        return result;
    }

    async getTranslation(word: string): Promise<DictionaryResponse | null> {
        let res = await axios.get(process.env.DICTIONARY_DOT_COM_API + '/' + word)
            .catch(console.error);

        if (res && res.data)
            return res.data as DictionaryResponse;
        return null;
    }
}

export default DictionaryService;