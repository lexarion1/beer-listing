import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiService } from '@services/Api/ApiService';
import { Product } from '@interfaces';
import { App } from './App';
import styles from './App.module.less';

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('App', () => {
    let app: App;

    const mockProducts = [
        {
            id: 1,
            description: 'A test beer',
            name: 'Beer 1',
            abv: 4.5,
            ibu: 20,
            image_url: 'http://example.com/beer1.jpg',
        },
        {
            id: 2,
            description: 'A test beer',
            name: 'Beer 2',
            abv: 4.5,
            ibu: 20,
            image_url: 'http://example.com/beer2.jpg',
        },
    ];

    beforeEach(() => {
        app = new App();
        document.body.appendChild(app);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it('should render loader initially', () => {
        const loader = app.querySelector(`.${styles.loader}`);
        expect(loader).toBeTruthy();
    });

    it('should render error message when API call fails', async () => {
        const fetchSpy = vi
            .spyOn(ApiService, 'fetchProducts')
            .mockRejectedValue(new Error('API Error'));

        app.connectedCallback();
        await flushPromises();

        const error = app.querySelector(`.${styles.error}`);
        expect(error).toBeTruthy();
        expect(fetchSpy).toHaveBeenCalled();
    });

    it('should render products list when API call succeeds', async () => {
        const fetchSpy = vi.spyOn(ApiService, 'fetchProducts').mockResolvedValue(mockProducts);

        app.connectedCallback();
        await flushPromises();

        const productsListElement = app.querySelector('products-list');
        expect(productsListElement).toBeTruthy();

        const appInstance = app as unknown as { items: Product[] };
        expect(appInstance.items).toEqual(mockProducts);
        expect(fetchSpy).toHaveBeenCalled();
    });
});
