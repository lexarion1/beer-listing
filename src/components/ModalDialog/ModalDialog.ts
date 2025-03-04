import '@components/Dropdown/Dropdown';
import { EventManager } from '@services/EventManager/EventManager';
import { Product } from '@interfaces';
import styles from './ModalDialog.module.less';

export class ModalDialog extends HTMLElement {
    private isOpen = false;

    private product: Product | null = null;

    private readonly listeners: Array<ReturnType<typeof EventManager.subscribe>> = [];

    constructor() {
        super();

        this.listeners.push(
            EventManager.subscribe<Product>(EventManager.EVENTS.MODAL.OPEN, (event) => {
                this.handleOpen(event.detail);
            }),

            EventManager.subscribe(EventManager.EVENTS.MODAL.CLOSE, () => {
                this.handleClose();
            }),
        );
    }

    disconnectedCallback() {
        this.listeners.forEach((unsubscribe) => unsubscribe());
    }

    private handleOpen(product: Product) {
        this.product = product;
        this.isOpen = true;
        this.render();
    }

    private handleClose() {
        this.product = null;
        this.isOpen = false;
        this.render();
    }

    private render() {
        if (!this.isOpen || !this.product) {
            this.innerHTML = '';
            return;
        }

        const ibuValue = this.product.ibu.toString().charAt(0);

        this.innerHTML = `
            <div class="${styles.backdrop}">
                <div class="${styles.modal} ${styles[`modal${ibuValue}`]}">
                    <span class="${styles.closeButton}">&times;</span>
                    <div class="${styles.product}">
                        <div class="${styles.media}">
                            <div class="${styles.face}">
                                <div class="${styles.faceInternal}">
                                    <img class="${styles.image}" src="${this.product.image_url}" alt="${this.product.name}" />
                                    <span class="${styles.ibu}">
                                        <span>IBU</span>
                                        <span>${this.product.ibu}</span>
                                    </span>
                                </div>
                                <div class="${styles.abv}">
                                    <span class="${styles.abvValue}">${this.product.abv}%</span>
                                </div>
                            </div>
                            <div class="${styles.name}">${this.product.name}</div>
                        </div>
                        <div class="${styles.description}">
                            ${this.product.description.trim()}
                        </div>
                    </div>
                    <div class="${styles.dropdown}">
                        <dropdown-menu ibu-value="${ibuValue}">
                        </dropdown-menu>
                    </div>
                </div>
            </div>
        `;

        const bindedHandleClose = this.handleClose.bind(this);

        this.querySelector(`.${styles.backdrop}`)?.addEventListener('click', (event) => {
            if (event.target !== event.currentTarget) {
                return;
            }

            bindedHandleClose();
        });

        this.querySelector(`.${styles.closeButton}`)?.addEventListener('click', bindedHandleClose);
    }
}

customElements.define('modal-dialog', ModalDialog);
