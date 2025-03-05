import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ModalDialog } from './ModalDialog';
import { EventManager } from '@services/EventManager/EventManager';
import { Product } from '@interfaces';

describe('ModalDialog', () => {
    let modalDialog: ModalDialog;

    beforeEach(() => {
        modalDialog = new ModalDialog();
        document.body.appendChild(modalDialog);
    });

    afterEach(() => {
        document.body.removeChild(modalDialog);
        vi.restoreAllMocks();
    });

    const mockProduct: Product = {
        id: 1,
        name: 'Test Beer',
        image_url: 'test.jpg',
        ibu: 30,
        abv: 5.5,
        description: 'A test beer',
    };

    it('should initialize with isOpen as false', () => {
        expect((modalDialog as any).isOpen).toBe(false);
    });

    it('should open modal when receiving MODAL.OPEN event', () => {
        EventManager.dispatch(EventManager.EVENTS.MODAL.OPEN, mockProduct);

        expect((modalDialog as any).isOpen).toBe(true);
        expect((modalDialog as any).product).toEqual(mockProduct);
        expect(modalDialog.innerHTML).not.toBe('');
    });

    it('should close modal when receiving MODAL.CLOSE event', () => {
        EventManager.dispatch(EventManager.EVENTS.MODAL.OPEN, mockProduct);
        EventManager.dispatch(EventManager.EVENTS.MODAL.CLOSE);

        expect((modalDialog as any).isOpen).toBe(false);
        expect((modalDialog as any).product).toBe(null);
        expect(modalDialog.innerHTML).toBe('');
    });

    it('should close modal when clicking on backdrop', () => {
        EventManager.dispatch(EventManager.EVENTS.MODAL.OPEN, mockProduct);

        const backdrop = modalDialog.querySelector('.backdrop');
        backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect((modalDialog as any).isOpen).toBe(false);
        expect(modalDialog.innerHTML).toBe('');
    });

    it('should close modal when clicking on close button', () => {
        EventManager.dispatch(EventManager.EVENTS.MODAL.OPEN, mockProduct);

        const closeButton = modalDialog.querySelector('.closeButton');
        closeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect((modalDialog as any).isOpen).toBe(false);
        expect(modalDialog.innerHTML).toBe('');
    });

    it('should unsubscribe from events on disconnectedCallback', () => {
        const unsubscribeSpy = vi.fn();
        (modalDialog as any).listeners = [unsubscribeSpy, unsubscribeSpy];

        modalDialog.disconnectedCallback();

        expect(unsubscribeSpy).toHaveBeenCalledTimes(2);
    });
});
