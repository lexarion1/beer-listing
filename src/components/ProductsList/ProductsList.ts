import '@components/ProductItem/ProductItem';
import { Product } from '@interfaces';
import { ProductItem } from '@components/ProductItem/ProductItem';
import styles from './ProductsList.module.less';

export class ProductsList extends HTMLElement {
    private items: Product[] = [];

    set data(items: Product[]) {
        this.items = items;

        if (this.isConnected) {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
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
