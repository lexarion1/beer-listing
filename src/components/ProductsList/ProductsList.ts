import '@components/ProductItem/ProductItem';
import { Product } from '@interfaces';
import { ApiService } from '@services/Api/ApiService';
import { ProductItem } from '@components/ProductItem/ProductItem';
import styles from './ProductsList.module.less';

export class ProductsList extends HTMLElement {
    private items: Product[] = [];

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
                <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdnl.iconscout.com%2Flottie%2Fpremium%2Fthumb%2Floader-dot-dark-point-animation-6790347-5577789.gif&f=1&nofb=1&ipt=7d20f5acb27de77d5b203427dee781b133e5ae73880df18cf511dcfc92399907&ipo=images" alt="loader" />
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
            <div class="${styles.container}"></div>
        `;

        const container = this.querySelector(`.${styles.container}`);

        if (container) {
            container.innerHTML = '';

            this.items.forEach((item) => {
                const productItem = document.createElement('product-item') as ProductItem;

                productItem.data = item;

                container.appendChild(productItem);
            });
        }
    }
}

customElements.define('products-list', ProductsList);
