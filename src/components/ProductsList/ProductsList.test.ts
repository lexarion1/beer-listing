import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ProductsList } from './ProductsList';
import itemStyles from '../ProductItem/ProductItem.module.less';
import listStyles from './ProductsList.module.less';
import { ApiService } from '@services/Api/ApiService';

describe('ProductsList', () => {
    let productsList: ProductsList;

    beforeEach(() => {
        vi.useFakeTimers();
        productsList = new ProductsList();
        document.body.appendChild(productsList);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should render loader when connected', () => {
        const loaderElement = productsList.querySelector('.loader img');
        expect(loaderElement).toBeTruthy();
        expect(loaderElement?.getAttribute('alt')).toBe('loader');
    });

    it('should render products when API call is successful', async () => {
        vi.spyOn(ApiService, 'fetchProducts').mockResolvedValue([
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
        ]);
        productsList.connectedCallback();
        await vi.runAllTimersAsync();

        const productItems = productsList.querySelectorAll(`.${itemStyles.container}`);
        expect(productItems.length).toBe(3); // because of container
    });

    it('should render error message when API call returns empty array', async () => {
        vi.spyOn(ApiService, 'fetchProducts').mockResolvedValue([]);
        productsList.connectedCallback();
        await vi.runAllTimersAsync();

        const errorElement = productsList.querySelector(`.${listStyles.error}`);
        expect(errorElement).toBeTruthy();
        expect(errorElement?.textContent).toContain('No beer today');
    });

    it('should render error message when API call fails', async () => {
        vi.spyOn(ApiService, 'fetchProducts').mockRejectedValue(new Error('API Error'));
        productsList.connectedCallback();
        await vi.runAllTimersAsync();

        const errorElement = productsList.querySelector(`.${listStyles.error}`);
        expect(errorElement).toBeTruthy();
        expect(errorElement?.textContent).toContain('No beer today');
    });
});
