import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiService } from './ApiService';
import { API_URL } from '@constants';

describe('ApiService', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should fetch products successfully', async () => {
        const mockData = {
            record: [
                { id: 1, name: 'Product 1' },
                { id: 2, name: 'Product 2' },
            ],
        };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const promise = ApiService.fetchProducts();
        vi.runAllTimers();
        const result = await promise;

        expect(global.fetch).toHaveBeenCalledWith(API_URL);
        expect(result).toEqual(mockData.record);
    });

    it('should handle network errors', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        const promise = ApiService.fetchProducts();
        vi.runAllTimers();

        await expect(promise).rejects.toThrow('Network error');
    });

    it('should handle non-ok responses', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
        });

        const promise = ApiService.fetchProducts();
        vi.runAllTimers();

        await expect(promise).rejects.toThrow('Network response was not ok');
    });

    it('should delay the response by 1 second', async () => {
        const mockData = {
            record: [{ id: 1, name: 'Product 1' }],
        };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const promise = ApiService.fetchProducts();

        expect(global.fetch).not.toHaveBeenCalled();

        vi.advanceTimersByTime(999);
        expect(global.fetch).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(global.fetch).toHaveBeenCalledTimes(1);

        vi.runAllTimers();
        await promise;
    });
});
