import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import { ProductsList } from './ProductsList';
import listStyles from './ProductsList.module.less';

describe('ProductsList', () => {
    let productsList: ProductsList;

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
        productsList = new ProductsList();
        document.body.appendChild(productsList);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should render empty container when no data is provided', () => {
        const container = productsList.querySelector(`.${listStyles.container}`);
        expect(container).toBeTruthy();
        expect(container?.children.length).toBe(0);
    });

    it('should render product items when data is provided', () => {
        productsList.data = mockProducts;

        const productItems = productsList.querySelectorAll('product-item');
        expect(productItems.length).toBe(2);
    });

    it('should update rendered items when data property changes', () => {
        productsList.data = mockProducts;
        expect(productsList.querySelectorAll('product-item').length).toBe(2);

        const updatedProducts = [mockProducts[0]];
        productsList.data = updatedProducts;
        expect(productsList.querySelectorAll('product-item').length).toBe(1);
    });

    it('should set data property on product items', () => {
        const mockProductItems: Element[] = [];
        const dataSetters: Mock[] = [];

        const originalCreateElement = document.createElement;
        const createElementMock = vi.fn((tagName: string): Element => {
            if (tagName === 'product-item') {
                const mockItem = originalCreateElement.call(document, 'div') as unknown as Element;
                const dataSetter = vi.fn();
                dataSetters.push(dataSetter);

                Object.defineProperty(mockItem, 'data', {
                    set: dataSetter,
                    configurable: true,
                    enumerable: true,
                });

                mockProductItems.push(mockItem);
                return mockItem;
            }
            return originalCreateElement.call(document, tagName) as unknown as Element;
        });

        document.createElement = createElementMock as unknown as typeof document.createElement;

        try {
            productsList.data = mockProducts;

            expect(dataSetters.length).toBe(2);
            expect(dataSetters[0]).toHaveBeenCalledWith(mockProducts[0]);
            expect(dataSetters[1]).toHaveBeenCalledWith(mockProducts[1]);
        } finally {
            document.createElement = originalCreateElement;
        }
    });
});
