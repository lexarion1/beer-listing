import { Product } from '@interfaces';
import { EventManager } from '@services/EventManager/EventManager';
import styles from './ProductItem.module.less';

export class ProductItem extends HTMLElement {
    private item: Product;

    set data(item: Product) {
        this.item = item;
        this.render();
    }

    connectedCallback() {
        this.render();
        this.addEventListener('click', () => {
            EventManager.dispatch(EventManager.EVENTS.MODAL.OPEN, this.item);
        });
    }

    private render() {
        if (!this.item) {
            return;
        }

        this.innerHTML = `
            <div class="${styles.container} ${styles[`container${this.item.ibu.toString().charAt(0)}`]}">
                <div class="${styles.badge}">
                    <span class="${styles.badgeValue}">${this.item.abv}%</span>
                </div>
                <div class="${styles.image}">
                    <img src="${this.item.image_url}" alt="${this.item.name}">
                </div>
                <div class="${styles.tag}">IBU: ${this.item.ibu}</div>
                <div class="${styles.name}">${this.item.name}</div>
            </div>
        `;
    }
}

customElements.define('product-item', ProductItem);
