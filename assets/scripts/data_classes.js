/*
 *  Author: Kaleb Jubar
 *  Created: 11 Apr 2024, 10:56:11 AM
 *  Last update: 11 Apr 2024, 12:12:46 PM
 *  Copyright (c) 2024 Kaleb Jubar
 */

/**
 * Data classes for loading from the API
 */

import { createDisplayCard } from "./main.js";
import { getElID } from "./utility.js";

/**
 * A class representing an operator
 * Has a getElement method for creating/accessing an element unique to the operator
 */
export class Operator {
    #id;
    name;
    image;

    constructor(id, name, image) {
        this.name = name;
        this.image = image;
        this.#id = id;
    }

    getElement() {
        // return element if it's created already
        let elem = getElID(this.#id);
        if (!!elem) {
            return elem;
        }
        
        // otherwise create and set it up
        elem = createDisplayCard(true, this.image, this.name);
        elem.id = this.#id;
        elem.addEventListener("click", this.#click.bind(this));

        return elem;
    }

    #click() {
        // raise an event saying the operator changed
        // if this is not selected, select it
        // otherwise deselect it
        const event = new CustomEvent("operatorChanged", {
            bubbles: true,
            detail: this.getElement().classList.contains("selected") ? {} : this
        });
        this.getElement().dispatchEvent(event);
    }
}