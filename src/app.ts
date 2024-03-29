import Vue from "vue";
import { TranslateResult } from "./contract/TranslatorInterface";
import DictionaryService from "./services/DictionaryService";
import App from './assets/js/App.vue';

class Translator {

    constructor(private appComponent: Vue | null = null, private translation: TranslateResult | null = null) {
        this.registerListener();
    }

    registerListener(): void {
        document.addEventListener('mouseup', (event: MouseEvent) => this.handleSelectedText(event));
    }

    async handleSelectedText(event: MouseEvent): Promise<void> {
        let selected = document.getSelection()?.toString().trim();
        if (this.isSelectedValid(event, selected)) {
            this.translation = await this.translateWord(selected!);
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
        } else {
            Vue.set(this.appComponent.$children[0], 'localTranslation', this.translation)
            Vue.set(this.appComponent.$children[0], 'hidden', false)
        }
    }

    async translateWord(word: string): Promise<TranslateResult | null> {
        let dictionaryService = new DictionaryService();
        return await dictionaryService.readTranslate(word);
    }

    createModal() {
        if (document.querySelector('.translator-wraper')) return;

        let divWraper = document.createElement('div');
        let innerContainer = document.createElement('div');
        innerContainer.id = 'main-wraper';
        divWraper.append(innerContainer);
        document.body.append(divWraper);
    }

    isSelectedValid(event: MouseEvent, selected: string | undefined): boolean {
        return !!(selected && event.ctrlKey && isNaN(Number(selected)));
    }
}

export default new Translator();