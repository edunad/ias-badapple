'use strict';

/*
 * Copyright © Mythical Rawr 2014-2017
 * Authors: Eduardo (failcake/edunad) de Sousa Fernandes, Alex (Bromvlieg) Brouwer, Harry (Hazzytje) van Wier
 */

import { MessageService } from './messageService.js';

/**
 * Handles key util functions (keyboard related)
 */
export class KeyService {
    #keyMapping = {};
    #pressingKeys = {};

    /**
     * keyUtil initializer
     *
     * @returns {void}
     */
    static initialize() {
        this.#keyMapping = {};
        this.#pressingKeys = {};

        this.#attachEvents();
    }

    /**
     * Get the keyboard key by id
     *
     * @param {string} keyList - the list to look for the key (player, blueprint, etc)
     * @param {string} key_id - the id of the key to get
     * @returns {any}
     */
    static getKeyById(keyList, key_id) {
        if (this.#keyMapping == null || this.#keyMapping.keys.length <= 0) return null;
        if (this.#keyMapping.keys[keyList] == null) return null;
        return this.#keyMapping.keys[keyList][key_id];
    }

    /**
     * Load the key mapping from the client
     *
     * @param {boolean} force - ignore the cache and force a reload
     * @param {(data: any) => void} callback - the callback function on load
     * @returns {any}
     */
    static loadKeyMapping(force, callback) {
        if (this.#keyMapping != null && this.#keyMapping.length > 0 && !force) {
            return callback(this.#keyMapping);
        }

        MessageService.queryUI(
            { event: 'GLOBAL_KEY_MAPPING' },
            (data) => {
                this.#keyMapping = JSON.parse(data);
                return callback(this.#keyMapping);
            },
            () => {
                throw 'Failed to query KEY MAPPING from client';
            },
        );
    }

    /**
     * Checks if the client is pressing the given keycode
     *
     * @param {number} keyCode - the keycode to check
     * @returns {boolean}
     */
    static isPressingKey(keyCode) {
        return this.#pressingKeys[keyCode];
    }

    static #attachEvents() {
        document.body.addEventListener('keydown', (e) => {
            this.#pressingKeys[e.keyCode] = true;
        });

        document.body.addEventListener('keyup', (e) => {
            this.#pressingKeys[e.keyCode] = false;
        });
    }
}

// Initialize it
KeyService.initialize();
