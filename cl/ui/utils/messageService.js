'use strict';

/*
 * Copyright © Mythical Rawr 2014-2017
 * Authors: Eduardo (failcake/edunad) de Sousa Fernandes, Alex (Bromvlieg) Brouwer, Harry (Hazzytje) van Wier
 */

import { MessageCallback } from './messageCallback.js';

/**
 * Sends message to server example
 */
export class MessageService {
    #listeners = {};

    /**
     * Unsubscribe a ui listener
     *
     * @param {string} listenerId - the unique listener id
     * @param {number} index - the index of the listener (uuid)
     * @returns {void}
     */
    static unsubscribeListener(listenerId, index) {
        if (this.#listeners[listenerId] == null) return;

        let callbacks = this.#listeners[listenerId].callbacks;
        if (index < 0 || index > callbacks.length) return;
        callbacks.splice(index, 1); // Remove it

        // Are there still registered listeners active?
        if (callbacks.length <= 0) {
            let queryID = this.#listeners[listenerId].queryID;

            window.cancelQueryUI(queryID);
            delete this.#listeners[listenerId]; // Remove the listener completly
        }
    }

    /**
     * Query the ui
     *
     * @param {any} data - the data to query the ui with
     * @param {(data: any) => void} onSuccess - success callback
     * @param {(err: any) => void} onError - error callback
     * @returns {void}
     */
    static queryUI(data, onSuccess, onError) {
        if (typeof data != typeof {} || data.event == null) throw "queryUI's data requires a event parameter!";

        window.queryUI({
            request: JSON.stringify(data),
            persistent: false,
            onSuccess: (response) => {
                if (onSuccess) onSuccess(response);
            },
            onFailure: (errcode, errmsg) => {
                if (onError) onError({ code: errcode, msg: errmsg });
            },
        });
    }

    /**
     * Create a ui listener
     *
     * @param {string} listenerId - the ui listener id
     * @param {(data: any) => void} onMessage - on message recieved
     * @param {(err: any) => void} onError - error callback
     * @returns {messageCallback}
     */
    static listenUI(listenerId, onMessage, onError) {
        // Create listener if it's the first one
        if (this.#listeners[listenerId] == null) {
            let queryID = window.queryUI({
                request: 'LISTENER_' + listenerId,
                persistent: true,
                onSuccess: (response) => {
                    this.#alertCallbacks(this.#listeners[listenerId].callbacks, true, response);
                },
                onFailure: (errcode, errmsg) => {
                    this.#alertCallbacks(this.#listeners[listenerId].callbacks, false, { code: errcode, msg: errmsg });
                },
            });

            this.#listeners[listenerId] = {
                queryID: queryID,
                callbacks: [],
            };
        }

        let id = this.#listeners[listenerId].length;
        let callback = new MessageCallback(listenerId, id, onMessage, onError);
        this.#listeners[listenerId].callbacks.push(callback);

        return callback;
    }

    /**
     * Alert all the stored callbacks with that id
     *
     * @param {Array<MessageCallback>} callbacks - the list with callbacks
     * @param {boolean} isSuccess - is the alert success or an error
     * @param {any} data - the data being alerted
     * @returns {void}
     */
    static #alertCallbacks(callbacks, isSuccess, data) {
        if (callbacks == null || callbacks.length <= 0) return;

        callbacks.forEach((call) => {
            if (call == null) return;
            isSuccess ? call.success(data) : call.error(data);
        });
    }
}
