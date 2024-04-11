/*
 *  Author: Kaleb Jubar
 *  Created: 11 Apr 2024, 10:56:11 AM
 *  Last update: 11 Apr 2024, 11:11:06 AM
 *  Copyright (c) 2024 Kaleb Jubar
 */

/**
 * Data classes for loading from the API
 */

import { createDisplayCard } from "./main.js";
import { getElID } from "./utility.js";

export class Operator {
    #id;
    name;
    icon;

    constructor(id, name, icon) {
        this.name = name;
        this.icon = icon;
        this.#id = id;
    }

    getElement() {
        // return element if it's created already
        let elem = getElID(this.#id);
        if (!!elem) {
            return elem;
        }
        
        // otherwise create and set it up
        elem = createDisplayCard(true, this.icon, this.name);
        elem.id = this.#id;
        elem.addEventListener("click", this.#click.bind(this));

        return elem;
    }

    #click() {
        console.log(this.name);
        this.getElement().classList.toggle("selected");
    }
}