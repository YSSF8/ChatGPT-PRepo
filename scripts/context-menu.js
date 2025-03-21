class ContextMenu {
    constructor(menuItems) {
        this.menuItems = menuItems;
        this.menuElement = this._createMenuElement();
        document.body.appendChild(this.menuElement);

        document.addEventListener('click', () => this.hide());
        document.addEventListener('contextmenu', (e) => {
            if (!e.target.closest('.context-menu')) {
                this.hide();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hide();
        });
    }

    _createMenuElement() {
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        Object.assign(menu.style, {
            position: 'fixed',
            display: 'block',
            backgroundColor: 'var(--secondary-bg-color)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--spacing)',
            overflow: 'hidden',
            zIndex: 1000,
            minWidth: '150px'
        });

        for (const [label, callback] of Object.entries(this.menuItems)) {
            const item = document.createElement('div');
            item.className = 'context-menu-item';
            item.textContent = label;
            Object.assign(item.style, {
                padding: 'var(--spacing)',
                cursor: 'pointer',
                transition: 'background 200ms'
            });
            item.addEventListener('click', e => {
                e.stopPropagation();
                callback();
                this.hide();
            });
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = 'var(--tertiary-bg-color)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = 'var(--secondary-bg-color)';
            });
            menu.appendChild(item);
        }
        return menu;
    }

    show(x, y) {
        document.body.appendChild(this.menuElement);

        const menuRect = this.menuElement.getBoundingClientRect();
        const menuWidth = menuRect.width;
        const menuHeight = menuRect.height;

        if (x + menuWidth > window.innerWidth) {
            x = window.innerWidth - menuWidth;
        }
        if (y + menuHeight > window.innerHeight) {
            y = window.innerHeight - menuHeight;
        }
        this.menuElement.style.left = `${x}px`;
        this.menuElement.style.top = `${y}px`;
    }

    hide() {
        if (this.menuElement && this.menuElement.parentNode) {
            this.menuElement.parentNode.removeChild(this.menuElement);
        }
    }
}