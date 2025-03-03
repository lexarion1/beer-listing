import '@components/ProductsList/ProductsList';
import '@components/ModalDialog/ModalDialog';
import styles from './App.module.less';

export class App extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    private render() {
        this.innerHTML = `
            <div class="${styles.container}">
                <header class="${styles.header}">
                    <h1 class="${styles.title}">Homework App</h1>
                </header>
                <main class="${styles.main}">
                    <products-list></products-list>
                </main>
                <modal-dialog></modal-dialog>
            </div>
        `;
    }
}

customElements.define('app-component', App);
