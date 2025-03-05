import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Image } from './Image';
import styles from './Image.module.less';

describe('Image Component', () => {
    let imageComponent: Image;

    beforeEach(() => {
        imageComponent = new Image();
        document.body.appendChild(imageComponent);
    });

    afterEach(() => {
        document.body.removeChild(imageComponent);
        vi.restoreAllMocks();
    });

    it('should render with default attributes', () => {
        expect(imageComponent.src).toBe('');
        expect(imageComponent.alt).toBe('');
    });

    it('should render with provided attributes', () => {
        // First set attributes
        imageComponent.setAttribute('src', 'test-image.jpg');
        imageComponent.setAttribute('alt', 'Test Image');

        // Force the attributeChangedCallback manually
        // since we're testing before the component implementation is complete
        (imageComponent as any).attributeChangedCallback('src', '', 'test-image.jpg');

        expect(imageComponent.querySelector(`.${styles.imageContainer}`)).toBeTruthy();

        const imgElement = imageComponent.querySelector(`.${styles.image}`);
        expect(imgElement).toBeTruthy();
        // @ts-expect-error
        expect(imgElement.getAttribute('src')).toBe('test-image.jpg');
        // @ts-expect-error
        expect(imgElement.getAttribute('alt')).toBe('Test Image');
        // @ts-expect-error
        expect(imgElement.classList.contains(styles.hidden)).toBe(true);

        const loaderElement = imageComponent.querySelector(`.${styles.imageLoader}`);
        expect(loaderElement).toBeTruthy();
        // @ts-expect-error
        expect(loaderElement.getAttribute('src')).toBe('loading.gif');
    });

    it('should update when attributes change', () => {
        imageComponent.setAttribute('src', 'initial.jpg');
        (imageComponent as any).attributeChangedCallback('src', '', 'initial.jpg');

        // @ts-expect-error
        expect(imageComponent.querySelector(`.${styles.image}`).getAttribute('src')).toBe('initial.jpg');

        imageComponent.setAttribute('src', 'updated.jpg');
        (imageComponent as any).attributeChangedCallback('src', 'initial.jpg', 'updated.jpg');

        // @ts-expect-error
        expect(imageComponent.querySelector(`.${styles.image}`).getAttribute('src')).toBe('updated.jpg');

        imageComponent.setAttribute('alt', 'Updated Alt');
        (imageComponent as any).attributeChangedCallback('alt', '', 'Updated Alt');

        // @ts-expect-error
        expect(imageComponent.querySelector(`.${styles.image}`).getAttribute('alt')).toBe('Updated Alt');
    });

    it('should show image and hide loader when image loads', () => {
        imageComponent.src = 'test-image.jpg';
        (imageComponent as any).attributeChangedCallback('src', '', 'test-image.jpg');

        const imgElement = imageComponent.querySelector(`.${styles.image}`) as HTMLImageElement;
        const loaderElement = imageComponent.querySelector(`.${styles.imageLoader}`) as HTMLImageElement;
        const loadEvent = new Event('load');
        imgElement.dispatchEvent(loadEvent);

        expect(imgElement.classList.contains(styles.hidden)).toBe(false);
        expect(loaderElement.classList.contains(styles.hidden)).toBe(true);
    });

    it('should show error image and hide loader when image fails to load', () => {
        imageComponent.src = 'non-existent.jpg';
        (imageComponent as any).attributeChangedCallback('src', '', 'non-existent.jpg');

        const imgElement = imageComponent.querySelector(`.${styles.image}`) as HTMLImageElement;
        const loaderElement = imageComponent.querySelector(`.${styles.imageLoader}`) as HTMLImageElement;
        const errorEvent = new Event('error');
        imgElement.dispatchEvent(errorEvent);

        expect(imgElement.src).toContain('error.png');
        expect(imgElement.classList.contains(styles.hidden)).toBe(false);
        expect(loaderElement.classList.contains(styles.hidden)).toBe(true);
    });

    it('should have the correct observed attributes', () => {
        expect(Image.observedAttributes).toEqual(['src', 'alt']);
    });
});