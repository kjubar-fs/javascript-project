/*
 *  Author: Kaleb Jubar
 *  Created: 9 Apr 2024, 3:19:41 PM
 *  Last update: 9 Apr 2024, 3:52:07 PM
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