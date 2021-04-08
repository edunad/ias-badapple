'use strict';
import { MathService } from './mathService.js';

/*
 * Copyright © Mythical Rawr 2014-2017
 * Authors: Eduardo (failcake/edunad) de Sousa Fernandes, Alex (Bromvlieg) Brouwer, Harry (Hazzytje) van Wier
 */

/**
 * Handles string util functions
 */
export class StringService {
    static corruptionChars = [
        '!',
        '§',
        '$',
        '%',
        '/',
        '(',
        ')',
        '=',
        '?',
        '_',
        '<',
        '>',
        '^',
        '°',
        '*',
        '#',
        '-',
        ':',
        ';',
        '~',
        '░',
        '▒',
        '▓',
        'Ø',
    ];

    /**
     * Generate a UUID, useful for creating html elements
     *
     * @returns {string}
     */
    static generateUUID() {
        let cryptoObj = window.crypto;
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
            (c ^ (cryptoObj.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
        );
    }

    /**
     * Hash a string into a number hash
     *
     * @param {string} string - the string to be hashed
     * @returns {number}
     */
    static hashString(str) {
        if (str == null || str.length <= 0) return 0;

        let hash = 0;
        let char = 0;

        for (let i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }

        return Math.abs(hash);
    }

    static generateCorruption(max) {
        let str = '';
        for (let i = 0; i < max; i++) {
            str += StringService.corruptionChars[MathService.randomInt(0, StringService.corruptionChars.length - 1)];
        }

        return str;
    }

    static getTextWidth(text, font, size) {
        const canvas = StringService.getTextWidth.canvas || (StringService.getTextWidth.canvas = document.createElement('canvas'));
        const context = canvas.getContext('2d');
        context.font = `${size} ${font}`;

        return context.measureText(text).width;
    }
}
