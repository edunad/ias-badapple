'use strict';

/*
 * Copyright © Mythical Rawr 2014-2017
 * Authors: Eduardo (failcake/edunad) de Sousa Fernandes, Alex (Bromvlieg) Brouwer, Harry (Hazzytje) van Wier
 */
import { MessageService } from './messageService.js';

/**
 * Handles view util functions
 */
export class ViewService {
    /**
     * Request the client to close the webframe
     *
     * @returns {void}
     */
    static closeFrame() {
        MessageService.queryUI({ event: 'ui_close' });
    }

    /**
     * Gets the absolute location of the game
     *
     * @returns {string}
     */
    static getGameLocation() {
        return window.gameLocation || '';
    }
}
