'use strict';

import { StringService } from '../../utils/stringService.js';
import { ViewService } from '../../utils/viewService.js';

import template from './template.js';

export class ui_frame extends HTMLElement {
    #title_element;
    #title_container_element;
    #content_container_element;

    #close_element;
    #qr_container_element;
    #qr_element;
    #qr_triangle_element;

    #closeBind = this.close.bind(this);

    connectedCallback() {
        if (!this.id) this.id = StringService.generateUUID();
        this.innerHTML = template({
            id: this.id,
            title: this.title,
            bgColor: this.bgColor,
            color: this.color,
            closable: this.closable,
            children: this.innerHTML,
            draggable: this.draggable,
            qr: this.qr,
        });

        this.#setVariables();
        this.#addListeners();

        this.#updateQR();
    }

    disconnectedCallback() {
        if (!this.#close_element) return;
        this.#close_element.removeEventListener('click', this.#closeBind, { passive: true });
    }

    static get observedAttributes() {
        return ['title', 'closable', 'qr', 'color', 'bg-color'];
    }

    #setVariables() {
        this.#close_element = this.querySelector(`#ui-frame-${this.id}-close`);
        this.#title_element = this.querySelector(`#ui-frame-${this.id}-title`);
        this.#title_container_element = this.querySelector(`#ui-frame-${this.id}-title-container`);
        this.#content_container_element = this.querySelector(`#ui-frame-${this.id}-content-container`);

        this.#qr_container_element = this.querySelector(`#ui-frame-${this.id}-qr-container`);
        this.#qr_triangle_element = this.querySelector(`#ui-frame-${this.id}-qr-triangle`);
        this.#qr_element = this.querySelector(`#ui-frame-${this.id}-qr`);
    }

    #addListeners() {
        if (!this.#close_element) return;
        this.#close_element.addEventListener('click', this.#closeBind, { passive: true });
    }

    close() {
        if (!this.closable) return;
        this.remove();
    }

    get color() {
        if (!this.hasAttribute('color')) return '#000';
        return this.getAttribute('color');
    }

    get bgColor() {
        if (!this.hasAttribute('bg-color')) return '#fff';
        return this.getAttribute('bg-color');
    }

    get title() {
        return this.getAttribute('title');
    }

    get closable() {
        return this.hasAttribute('closable');
    }

    get draggable() {
        return this.hasAttribute('draggable');
    }

    get qr() {
        return this.hasAttribute('qr');
    }

    #updateQR() {
        if (!this.#qr_container_element || !this.#qr_element) return;

        if (this.qr) {
            this.#qr_container_element.classList.remove('hidden');
            this.#qr_element.generate();
        } else {
            this.#qr_container_element.classList.add('hidden');
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'title') {
            if (!this.#title_element) return;
            this.#title_element.innerText = `://${newValue}`;
        } else if (name === 'closable') {
            if (!this.#close_element) return;

            if (this.closable) {
                this.#close_element.classList.remove('hidden');
            } else {
                this.#close_element.classList.add('hidden');
            }
        } else if (name === 'qr') {
            this.#updateQR();
        } else if (name === 'color') {
            if (!this.#title_element) return;
            this.#title_element.style.color = newValue;
        } else if (name === 'bg-color') {
            if (this.#title_container_element) {
                this.#title_container_element.style.backgroundColor = newValue;
                this.#title_container_element.style.borderColor = newValue;
            }

            if (this.#content_container_element) {
                this.#content_container_element.style.borderColor = newValue;
            }

            if (this.#qr_element) {
                this.#qr_element.setAttribute('color', newValue);
            }

            if (this.#qr_triangle_element) {
                this.#qr_triangle_element.style.borderTopColor = newValue;
            }
        }
    }
}
