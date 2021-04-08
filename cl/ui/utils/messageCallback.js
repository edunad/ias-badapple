'use strict';

/*
 * Copyright © Mythical Rawr 2014-2017
 * Authors: Eduardo (failcake/edunad) de Sousa Fernandes, Alex (Bromvlieg) Brouwer, Harry (Hazzytje) van Wier
 */

/**
 * Message callback object
 */
export class MessageCallback {
    #listenerId;
    #id;
    #onSuccess;
    #onError;

    /**
     * messageCallback constructor
     * @constructor
     *
     * @param {string} listenerId - the unique listener id
     * @param {number} uuid - the uuid of the callback
     * @param {(data: any) => void} onSuccess - on message success
     * @param {Function} onError - on message error
     * @returns {void}
     */
    constructor(listenerId, uuid, onSuccess, onError) {
        this.#listenerId = listenerId;
        this.#id = uuid;
        this.#onSuccess = onSuccess;
        this.#onError = onError;
    }

    /**
     * OnSuccess
     *
     * @param {any} data - the return success data
     * @returns {void}
     */
    success(data) {
        if (this.#onSuccess == null) return;
        this.#onSuccess(data);
    }

    /**
     * OnError
     *
     * @param {any} data - the return error data
     * @returns {void}
     */
    error(data) {
        if (this.#onError == null) return;
        this.#onError(data);
    }

    /**
     * Returns the uuid of this callback
     *
     * @returns {number}
     */
    get id() {
        return this.#id;
    }

    /**
     * Returns the listener id of this callback
     *
     * @returns {string}
     */
    get listenerId() {
        return this.#listenerId;
    }
}
