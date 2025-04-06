/**
 * Represents a modal dialog.
 */
class Modal {
    /**
     * Creates an instance of Modal.
     *
     * @param {string|HTMLElement} content - The content to display inside the modal. If a string is provided,
     *                                         it will be converted to HTML. Otherwise, the provided HTMLElement
     *                                         will be appended.
     */
    constructor(content) {
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        this.overlay.style.display = 'none';

        this.modal = document.createElement('div');
        this.modal.className = 'modal';

        this.closeButton = document.createElement('button');
        this.closeButton.className = 'close-button';
        this.closeButton.innerHTML = '&times;';

        this.modal.appendChild(this.closeButton);
        if (typeof content === 'string') {
            const contentElem = document.createElement('div');
            contentElem.innerHTML = content;
            this.modal.appendChild(contentElem);
        } else {
            this.modal.appendChild(content);
        }

        this.overlay.appendChild(this.modal);
        document.body.appendChild(this.overlay);

        this.closeButton.addEventListener('click', () => this.remove());
        this.overlay.addEventListener('click', e => {
            if (e.target === this.overlay) this.remove();
        });
    }

    /**
     * Displays the modal dialog by setting the overlay's display style.
     */
    show() {
        this.overlay.style.display = 'flex';
    }

    /**
     * Hides the modal dialog by setting the overlay's display style to 'none'.
     */
    hide() {
        this.overlay.style.display = 'none';
    }

    /**
     * Removes the modal dialog from the DOM.
     */
    remove() {
        this.overlay.remove();
    }
}


/**
 * Represents a toast notification.
 */
class Toast {
    /**
     * 
     * @param {string} message The content of the toast message.
     */
    constructor(message) {
        this.toasts = document.querySelector('.toasts') || document.createElement('div');
        this.toasts.className = 'toasts';
        document.body.appendChild(this.toasts);

        this.toast = document.createElement('div');
        this.toast.className = 'toast';
        this.toast.textContent = message;
        this.toasts.appendChild(this.toast);
    }

    show() {
        this.toast.classList.add('show');

        setTimeout(() => {
            this.toast.classList.remove('show');

            setTimeout(() => {
                this.toast.remove();

                if (this.toasts.children.length === 0) {
                    this.toasts.remove();
                }
            }, 300);

        }, 3000);
    }

    hide() {
        this.toast.classList.remove('show');
        setTimeout(() => {
            this.toast.remove();
        }, 300);
    }

    remove() {
        this.toast.remove();
    }
}