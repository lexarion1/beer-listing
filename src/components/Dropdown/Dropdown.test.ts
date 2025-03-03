import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Dropdown } from './Dropdown';
import styles from './Dropdown.module.less';

describe('Dropdown', () => {
    let dropdown: Dropdown;

    beforeEach(() => {
        dropdown = new Dropdown();
        document.body.appendChild(dropdown);
    });

    afterEach(() => {
        document.body.removeChild(dropdown);
        vi.restoreAllMocks();
    });

    it('renders the initial state correctly', () => {
        expect(dropdown.querySelector('button')).toBeTruthy();
        expect(dropdown.querySelector('button')?.textContent).toContain('Order');
    });

    it('opens the dropdown menu when clicked', () => {
        const button = dropdown.querySelector('button');
        button?.click();
        expect(dropdown.querySelector(`.${styles.menu}`)).toBeTruthy();
    });

    it('closes the dropdown menu when clicked outside', () => {
        const button = dropdown.querySelector('button');
        button?.click();
        document.body.click();
        expect(dropdown.querySelector(`.${styles.menu}`)).toBeFalsy();
    });

    it('opens a submenu when a menu item is clicked', () => {
        console.log(`.${styles.subMenu}`);
        const button = dropdown.querySelector('button');
        button?.click();
        const menuItem = dropdown.querySelector('[data-item="GLASS"]') as HTMLElement;
        menuItem?.click();
        expect(dropdown.querySelector(`.${styles.subMenu}`)).toBeTruthy();
    });

    it('closes the submenu when the same menu item is clicked again', () => {
        const button = dropdown.querySelector('button');
        button?.click();
        const menuItem = dropdown.querySelector('[data-item="GLASS"]') as HTMLElement;
        menuItem?.click();
        menuItem?.click();
        expect(dropdown.querySelector(`.${styles.subMenu}`)).toBeFalsy();
    });

    it('selects an item when a submenu item is clicked', () => {
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
        const button = dropdown.querySelector('button');
        button?.click();
        const menuItem = dropdown.querySelector('[data-item="GLASS"]') as HTMLElement;
        menuItem?.click();
        const subMenuItem = dropdown.querySelector('[data-count="2"]') as HTMLElement;
        subMenuItem?.click();
        expect(alertMock).toHaveBeenCalledWith('Selected: GLASS - 2');
    });

    it('sets up and disconnects IntersectionObserver correctly', () => {
        const observeMock = vi.fn();
        const disconnectMock = vi.fn();
        vi.spyOn(window, 'IntersectionObserver').mockImplementation(
            () =>
                ({
                    observe: observeMock,
                    disconnect: disconnectMock,
                }) as any
        );

        dropdown.connectedCallback();
        expect(observeMock).not.toHaveBeenCalled();

        const button = dropdown.querySelector('button');
        button?.click();
        expect(observeMock).toHaveBeenCalled();

        dropdown.disconnectedCallback();
        expect(disconnectMock).toHaveBeenCalled();
    });

    it('applies the correct CSS class based on ibu-value attribute', () => {
        dropdown.setAttribute('ibu-value', '5');
        dropdown.connectedCallback();
        expect(dropdown.querySelector(`.${styles.container}5`)).toBeTruthy();
    });
});
