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
                <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.tenor.com%2FdHAJxtIpUCoAAAAi%2Floading-animation.gif&f=1&nofb=1&ipt=1964972cde0a78f28404a9237eb911d81c059843a27269bf8d69dfdfa1eff02f&ipo=images" alt="loader" />
            </div>
        `;
    }

    private renderError() {
        this.innerHTML = `
            <div class="${styles.error}">
                <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fclipartix.com%2Fwp-content%2Fuploads%2F2016%2F06%2FSad-face-clip-art-black-and-white-free-clipart.png&f=1&nofb=1&ipt=5f6cbe4c30c6b7a9c8ba7c576bfc1df71737446b5b2a3a25232eabd288fc11df&ipo=images" alt="empty" />
                <div>No beer today</div>
            </div>
        `;
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

        const main = this.querySelector(`.${styles.main}`);

        const productsList = document.createElement('products-list') as ProductsList;

        productsList.data = this.items;

        if (main) {
            main.appendChild(productsList);
        }
    }
}

customElements.define('app-component', App);
