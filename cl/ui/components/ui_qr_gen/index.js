'use strict';

import { MathService } from '../../utils/mathService.js';
import { StringService } from '../../utils/stringService.js';
import template from './template.js';

export class ui_qr_gen extends HTMLElement {
    #canvas_element;
    #canvas_context;

    connectedCallback() {
        if (!this.id) this.id = StringService.generateUUID();
        this.innerHTML = template({ id: this.id });

        this.#setVariables();
        this.generate();
    }

    static get observedAttributes() {
        return ['color', 'noise', 'bg-color', 'cubeSize'];
    }

    get cubeSize() {
        if (!this.hasAttribute('cubeSize')) return 3;
        return parseInt(this.getAttribute('cubeSize'), 10);
    }

    get color() {
        if (!this.hasAttribute('color')) return '#fff';
        return this.getAttribute('color');
    }

    get noise() {
        if (!this.hasAttribute('noise')) return 2;
        return this.getAttribute('noise');
    }

    get bgColor() {
        if (!this.hasAttribute('bg-color')) return null;
        return this.getAttribute('bg-color');
    }

    #setVariables() {
        this.#canvas_element = this.querySelector(`#ui-qr-gen-${this.id}-canvas`);
        this.#canvas_context = this.#canvas_element.getContext('2d');
    }

    #updateSize() {
        this.#canvas_element.width = this.clientWidth;
        this.#canvas_element.height = this.clientHeight;
    }

    generate() {
        if (!this.#canvas_context) return;
        this.#updateSize();

        const Qsize = this.cubeSize;
        this.#canvas_context.clearRect(0, 0, this.clientWidth, this.clientHeight);

        if (this.bgColor) {
            this.#canvas_context.fillStyle = this.bgColor;
            this.#canvas_context.fillRect(0, 0, this.clientWidth, this.clientHeight);
        }

        this.#canvas_context.fillStyle = this.color;

        let x = 0;

        // STARTER LINES //
        for (let i = 0; i < MathService.randomInt(3, 6); i++) {
            const size = MathService.randomInt(1, 2);
            this.#line(x, size);

            x += MathService.randomInt(1, 3) + size;
        }

        // ---
        // CUBES
        for (let xPos = x + 2; xPos < this.clientWidth - Qsize; xPos += Qsize) {
            for (let yPos = 0; yPos < this.clientHeight - Qsize; yPos += Qsize) {
                if (MathService.randomInt(1, this.noise) == 2) continue;

                this.#cube(xPos, yPos, Qsize);
            }
        }
    }

    #cube(x, y, size) {
        if (!this.#canvas_context) return;
        this.#canvas_context.fillRect(x, y, size, size);
    }

    #line(x, width) {
        if (!this.#canvas_context) return;
        this.#canvas_context.fillRect(x, 0, width, this.clientHeight);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this.generate();
    }
}
