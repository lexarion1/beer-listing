import '@components/ProductsList/ProductsList';
import '@components/ModalDialog/ModalDialog';
import { ApiService } from '@services/Api/ApiService';
import { ProductsList } from '@components/ProductsList/ProductsList';
import { Product } from '@interfaces';
import styles from './App.module.less';

export class App extends HTMLElement {
    private items: Product[] = [];

    constructor() {
        super();
    }

    connectedCallback() {
        this.renderLoader();

        ApiService.fetchProducts()
            .then((items) => {
                if (!items.length) {
                    this.renderError();
                } else {
                    this.items = items;
                    this.render();
                }
            })
            .catch(() => {
                this.renderError();
            });
    }

    private renderLoader() {
        this.innerHTML = `
            <div class="${styles.loader}">
                <img src="loading.gif" alt="loader" />
            </div>
        `;
    }

    private renderError() {
        this.innerHTML = `
            <div class="${styles.error}">
                <img src="error.png" alt="empty" />
                <div>No beer today</div>
            </div>
        `;
    }

    private render() {
        this.innerHTML = `
            <div class="${styles.container}">
                <header class="${styles.header}">
                    <h1 class="${styles.title}">Beer listing</h1>
                </header>
                <main class="${styles.main}">
                    <products-list></products-list>
                </main>
                <modal-dialog></modal-dialog>
            </div>
        `;

        const main = this.querySelector(`.${styles.main}`);

        const productsList = document.createElement('products-list') as ProductsList;

        productsList.data = this.items;

        if (main) {
            main.appendChild(productsList);
        }
    }
}

customElements.define('app-component', App);
