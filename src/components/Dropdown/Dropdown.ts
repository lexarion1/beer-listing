import styles from './Dropdown.module.less';

export class Dropdown extends HTMLElement {
    private readonly items = ['GLASS', 'CAN', 'BOX'];

    private readonly counts = [1, 2, 3];

    private isOpen = false;

    private selectedItem: string | null = null;

    private menu: HTMLElement | null = null;

    private subMenu: HTMLElement | null = null;

    private intersectionObserver: IntersectionObserver | null = null;

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.setupIntersectionObserver();
    }

    disconnectedCallback() {
        this.removeEventListeners();
        this.intersectionObserver?.disconnect();
    }

    private setupEventListeners() {
        this.addEventListener('click', this.handleClick);
        document.addEventListener('click', this.handleDocumentClick);
    }

    private removeEventListeners() {
        this.removeEventListener('click', this.handleClick);
        document.removeEventListener('click', this.handleDocumentClick);
    }

    private setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver(this.handleIntersection, {
            root: null,
            rootMargin: '0px',
            threshold: 1.0,
        });
    }

    private handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                this.adjustPosition(entry.target as HTMLElement);
            }
        });
    };

    private handleClick = (event: Event) => {
        const target = event.target as HTMLElement;

        const button = target.closest(`.${styles.button}`);
        const menuItem = target.closest(`.${styles.menuItem}`) as HTMLElement;
        const subMenuItem = target.closest(`.${styles.subMenuItem}`) as HTMLElement;

        if (button) {
            this.toggleDropdown();
        } else if (subMenuItem) {
            this.handleSelection(subMenuItem.dataset.count ?? '');
        } else if (menuItem) {
            this.toggleSubmenu(menuItem.dataset.item ?? null);
        }
    };

    private handleDocumentClick = (event: Event) => {
        if (!this.contains(event.target as Node) && this.isOpen) {
            this.closeAll();
        }
    };

    private toggleDropdown() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.renderMenu();
            this.intersectionObserver?.observe(this.menu!);
        } else {
            this.menu?.remove();
            this.intersectionObserver?.unobserve(this.menu!);
        }
    }

    private toggleSubmenu(item: string | null) {
        if (this.selectedItem === item) {
            this.closeSubmenu();
        } else {
            this.openSubmenu(item);
        }
    }

    private closeSubmenu() {
        this.selectedItem = null;
        this.subMenu?.remove();
        this.querySelector(`.${styles.selected}`)?.classList.remove(styles.selected);
    }

    private openSubmenu(item: string | null) {
        this.closeSubmenu();
        this.selectedItem = item;
        const menuItem = this.querySelector(`[data-item="${item}"]`);

        if (menuItem) {
            menuItem.classList.add(styles.selected);
            this.subMenu = this.createSubmenu();
            menuItem.appendChild(this.subMenu);
            this.intersectionObserver?.observe(this.subMenu);
        }
    }

    private createSubmenu(): HTMLElement {
        const subMenu = document.createElement('menu');
        subMenu.classList.add(styles.subMenu);
        subMenu.innerHTML = this.counts
            .map(
                (count) => `
                <menuitem class="${styles.subMenuItem}" data-count="${count}">
                    <span>${count}</span>
                </menuitem>
            `,
            )
            .join('');
        return subMenu;
    }

    private adjustPosition(element: HTMLElement) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Reset position first
        element.style.left = '';
        element.style.top = '';

        const updatedRect = element.getBoundingClientRect();

        if (updatedRect.right > viewportWidth) {
            element.style.left = `${viewportWidth - updatedRect.right - 10}px`;
        }

        if (updatedRect.bottom > viewportHeight) {
            element.style.top = `${viewportHeight - updatedRect.bottom - 10}px`;
        }
    }

    private handleSelection(count: string) {
        alert(`Selected: ${this.selectedItem} - ${count}`);
        this.closeAll();
    }

    private closeAll() {
        this.isOpen = false;
        this.selectedItem = null;
        this.menu?.remove();
        this.subMenu?.remove();
    }

    private renderMenu() {
        this.menu = document.createElement('menu');
        this.menu.className = styles.menu;
        this.menu.innerHTML = this.items
            .map(
                (item) => `
                <menuitem class="${styles.menuItem}" data-item="${item}">
                    <span>${item}</span> <i class="fa fa-chevron-right"></i>
                </menuitem>
            `,
            )
            .join('');

        this.querySelector(`.${styles.container}`)?.appendChild(this.menu);
    }

    private render() {
        const ibuValue = this.getAttribute('ibu-value') ?? '';

        this.innerHTML = `
            <div class="${styles.container} ${styles[`container${ibuValue}`]}">
                <button type="button" class="${styles.button}">
                    Order <i class="fa fa-chevron-down"></i>
                </button>
            </div>
        `;
    }
}

customElements.define('dropdown-menu', Dropdown);
