import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ProductItem } from './ProductItem';
import { EventManager } from '@services/EventManager/EventManager';

describe('ProductItem', () => {
    let productItem: ProductItem;

    beforeEach(() => {
        productItem = new ProductItem();
        document.body.appendChild(productItem);
    });

    afterEach(() => {
        document.body.removeChild(productItem);
    });

    it('should render empty when no data is set', () => {
        expect(productItem.innerHTML).toBe('');
    });

    it('should render correctly when data is set', () => {
        productItem.data = {
            id: 1,
            description: 'A test beer',
            name: 'Test Beer',
            abv: 5.5,
            ibu: 30,
            image_url: 'http://example.com/beer.jpg',
        };

        expect(productItem.innerHTML).toContain('Test Beer');
        expect(productItem.innerHTML).toContain('5.5%');
        expect(productItem.innerHTML).toContain('IBU: 30');
        expect(productItem.innerHTML).toContain('http://example.com/beer.jpg');
    });

    it('should update render when data changes', () => {
        const mockProduct1 = {
            id: 1,
            description: 'A test beer',
            name: 'Beer 1',
            abv: 4.5,
            ibu: 20,
            image_url: 'http://example.com/beer1.jpg',
        };

        const mockProduct2 = {
            id: 2,
            description: 'A test beer 2',
            name: 'Beer 2',
            abv: 6.5,
            ibu: 40,
            image_url: 'http://example.com/beer2.jpg',
        };

        productItem.data = mockProduct1;
        expect(productItem.innerHTML).toContain('Beer 1');

        productItem.data = mockProduct2;
        expect(productItem.innerHTML).toContain('Beer 2');
    });

    it('should apply correct CSS classes based on IBU', () => {
        const mockProduct = {
            id: 1,
            description: 'A test beer',
            name: 'Test Beer',
            abv: 5.5,
            ibu: 35,
            image_url: 'http://example.com/beer.jpg',
        };

        productItem.data = mockProduct;
        expect(productItem.innerHTML).toContain('container3');

        mockProduct.ibu = 42;
        productItem.data = mockProduct;
        expect(productItem.innerHTML).toContain('container4');
    });

    it('should dispatch MODAL.OPEN event when clicked', () => {
        const mockProduct = {
            id: 1,
            description: 'A test beer',
            name: 'Test Beer',
            abv: 5.5,
            ibu: 30,
            image_url: 'http://example.com/beer.jpg',
        };

        productItem.data = mockProduct;

        const dispatchSpy = vi.spyOn(EventManager, 'dispatch');

        productItem.click();

        expect(dispatchSpy).toHaveBeenCalledWith(EventManager.EVENTS.MODAL.OPEN, mockProduct);
    });
});
