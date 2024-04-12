/*
 *  Author: Kaleb Jubar
 *  Created: 11 Apr 2024, 10:56:11 AM
 *  Last update: 11 Apr 2024, 8:34:47 PM
 *  Copyright (c) 2024 Kaleb Jubar
 */

/**
 * Data classes for loading from the API
 */

import { createDisplayCard, updateOperator } from "./main.js";
import { getElID, createEl } from "./utility.js";

/**
 * A class representing an operator
 * Has a getElement method for creating/accessing an element unique to the operator
 */
export class Operator {
    #id;
    name;
    image;

    constructor(id, name, image) {
        this.#id = id;
        this.name = name;
        this.image = image;
    }

    get id() {
        return this.#id;
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
        // if this card is currently selected, return an empty object so it's deselected
        // otherwise return this to select it
        updateOperator(this.getElement().classList.contains("selected") ? {} : this);
    }
}

/**
 * A class representing a weapon
 */
export class Weapon {
    #id;
    name;
    categoryId;
    teamId;
    skins;

    constructor(id, name, categoryId, teamId) {
        this.#id = id;
        this.name = name;
        this.categoryId = categoryId;
        this.teamId = teamId;
        this.skins = [];
    }

    get id() {
        return this.#id;
    }

    addSkin(skin) {
        this.skins.push(skin);
    }

    getElement() {
        // return element if it's created already
        let elem = getElID(this.#id);
        if (!!elem) {
            return elem;
        }
        
        // otherwise create and set it up
        elem = createEl("div", {
            id: this.#id,
            className: "weapon-selector cursor-pointer",
            innerText: this.name
        });
        elem.addEventListener("click", this.#click.bind(this));

        return elem;
    }

    #click() {
        // if this weapon is currently selected, return an empty object so it's deselected
        // otherwise return this to select it
        // updateWeapon(this.getElement().classList.contains("selected") ? {} : this);
    }
}

/**
 * A class representing a skin
 */
export class Skin {
    #id;
    name;
    image;

    constructor(id, name, image) {
        this.#id = id;
        this.name = name;
        this.image = image;
    }

    get id() {
        return this.#id;
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
        // if this card is currently selected, return an empty object so it's deselected
        // otherwise return this to select it
        // updateSkin(this.getElement().classList.contains("selected") ? {} : this);
    }
}