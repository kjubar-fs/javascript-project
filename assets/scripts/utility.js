/*
 *  Author: Kaleb Jubar
 *  Created: 9 Apr 2024, 3:19:41 PM
 *  Last update: 12 Apr 2024, 3:10:34 PM
 *  Copyright (c) 2024 Kaleb Jubar
 */

/**
 * Get the DOM element with the provided ID
 * @param {string} id 
 * @returns a DOM element, or null if not found
 */
export function getElID(id) {
    return document.getElementById(id);
}

/**
 * Get the first element in the DOM that matches the CSS selector
 * @param {string} sel a valid CSS selector
 * @returns a DOM element, or null if not found
 */
export function getElSlct(sel) {
    return document.querySelector(sel);
}

/**
 * Create a new DOM element
 * @param {string} tag element tag
 * @param {Object} props properties for DOM element
 * @returns a new DOM element object with the specified tag and properties
 */
export function createEl(tag, props) {
    // create base element
    let el = document.createElement(tag);
    
    // map properties from props Object to element
    Object.keys(props).forEach(key => {
        el[key] = props[key];
    });

    return el;
}

/**
 * Get a random integer in the given range
 * Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param {number} min minimum range
 * @param {number} max maximum range
 * @returns generated int
 */
export function getRandomInt(min, max) {
    let minCeiled = Math.ceil(min);
    let maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

/**
 * Given a number, round it to the nearest specified multiple
 * e.g. roundToNearestMultiple(145, 50) returns 150
 * @param {number} num number to round
 * @param {number} multiple multiple to round to
 * @returns rounded number
 */
export function roundToNearestMultiple(num, multiple) {
    // if the number is a multiple or the multiple is 1 or less, just return num
    if (num % multiple === 0 || multiple < 2) {
        return num;
    }

    // add half the value of the multiple, then subtract the remainder
    // this will round up numbers over the halfway point, but round down
    // anything under it
    let result = num + multiple / 2;
    result -= result % multiple;
    return result;
}