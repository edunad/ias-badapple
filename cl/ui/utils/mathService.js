'use strict';

/*
 * Copyright © Mythical Rawr 2014-2017
 * Authors: Eduardo (failcake/edunad) de Sousa Fernandes, Alex (Bromvlieg) Brouwer, Harry (Hazzytje) van Wier
 */

/**
 * Handles math util functions
 */
export class MathService {
    /**
     * Generate a random int (inclusive)
     *
     * @param {number} min - the min value
     * @param {number} max - the max value
     * @returns {number}
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
    }

    /**
     * Round a number with x decimals
     *
     * @param {number} value - the value to be rounded
     * @param {number} decimals - the decimals
     * @returns {number}
     */
    static roundProgress(value, decimals) {
        return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
    }

    /**
     * Clamp a number between a min and max
     *
     * @param {number} min - the min number
     * @param {number} max - the max number
     * @returns {number}
     */
    static clamp(val, min, max) {
        if (val < min) val = min;
        if (val > max) val = max;
        return val;
    }

    /**
     * Shuffles an array
     *
     * @param {array} original - the array to be shuffled
     * @returns {void}
     */
    static shuffleArray(original) {
        for (let i = original.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [original[i], original[j]] = [original[j], original[i]];
        }
    }
}
