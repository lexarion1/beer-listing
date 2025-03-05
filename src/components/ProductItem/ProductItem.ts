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

    private addImageListeners() {
        const img = this.querySelector(`.${styles.image}`) as HTMLImageElement;
        const loader = this.querySelector(`.${styles.imageLoader}`) as HTMLElement;

        if (img) {
            img.addEventListener('load', () => {
                img.classList.remove(`${styles.hidden}`);
                loader.classList.add(`${styles.hidden}`);
            });

            img.addEventListener('error', () => {
                if (loader) {
                    loader.classList.add(`${styles.hidden}`);
                }

                img.src = 'error.png';
                img.classList.remove(`${styles.hidden}`);
            });
        }
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
                <div class="${styles.imageContainer}">
                    <img class="${styles.imageLoader}" src="loading.gif" alt="loader">
                    <img class="${styles.image} ${styles.hidden}" src="${this.item.image_url}" alt="${this.item.name}">
                </div>
                <div class="${styles.tag}">IBU: ${this.item.ibu}</div>
                <div class="${styles.name}">${this.item.name}</div>
            </div>
        `;

        this.addImageListeners();
    }
}

customElements.define('product-item', ProductItem);
