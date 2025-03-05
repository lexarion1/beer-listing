import styles from './Image.module.less';

export class Image extends HTMLElement {
    static get observedAttributes() {
        return ['src', 'alt'];
    }

    get src() {
        return this.getAttribute('src') || '';
    }

    set src(value: string) {
        this.setAttribute('src', value);
    }

    get alt() {
        return this.getAttribute('alt') || '';
    }

    set alt(value: string) {
        this.setAttribute('alt', value);
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(_: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            this.render();
        }
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
        this.innerHTML = `
            <div class="${styles.imageContainer}">
                <img class="${styles.imageLoader}" src="loading.gif" alt="loader">
                <img class="${styles.image} ${styles.hidden}" src="${this.src}" alt="${this.alt}">
            </div>
        `;

        this.addImageListeners();
    }
}

customElements.define('image-component', Image);
