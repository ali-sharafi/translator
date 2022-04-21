import Vue from "vue";
import { TranslateResult } from "./contract/TranslatorInterface";
import DictionaryService from "./services/DictionaryService";
import App from './assets/js/App.vue';

class Translator {
    wordsList: Array<string>;

    constructor(private appComponent: Vue | null = null, private translation: TranslateResult | null = null) {
        this.registerListener();
        this.wordsList = [];
    }

    registerListener(): void {
        document.addEventListener('mouseup', () => this.handleSelectedText());
    }

    async handleSelectedText(): Promise<void> {
        let selected = document.getSelection()?.toString().trim();
        if (selected && this.isSelectedValid(selected)) {
            this.wordsList.push(selected);
            this.translation = await this.translateWord(selected);
            this.createModal();
            if (this.translation)
                this.mountDataToPage();
        }
    }

    mountDataToPage() {
        if (!this.appComponent) {
            this.appComponent = new Vue({
                el: '#main-wraper',
                render: h => h(App, { props: { translation: this.translation } })
            });
        }
        console.log('vue: ', this.appComponent);
    }

    async translateWord(word: string): Promise<TranslateResult | null> {
        let dictionaryService = new DictionaryService();
        return await dictionaryService.readTranslate(word);
    }

    createModal() {
        if (document.querySelector('.translator-wraper')) return;

        let divWraper = document.createElement('div');
        divWraper.className = 'translator-wraper';
        let innerContainer = document.createElement('div');
        innerContainer.id = 'main-wraper';
        divWraper.append(innerContainer);
        document.body.append(divWraper);
    }

    isSelectedValid(selected: string): boolean {
        return !!(isNaN(Number(selected)) && this.wordsList.indexOf(selected) === -1)
    }
}

export default new Translator();