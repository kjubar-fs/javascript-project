/*
 *  Author: Kaleb Jubar
 *  Created: 11 Apr 2024, 10:56:11 AM
 *  Last update: 12 Apr 2024, 11:40:34 AM
 *  Copyright (c) 2024 Kaleb Jubar
 */

/**
 * Data classes for loading from the API
 */

import { getElFromContentByID, createDisplayCard, updateOperator, updateWeapon, selectSkin } from "./main.js";
import { createEl } from "./utility.js";

/**
 * A class representing an operator
 * Has a getElement method for creating/accessing an element unique to the operator
 */
export class Operator {
    #id;
    name;
    image;
    teamAbbr;

    constructor(id, name, image, teamAbbr) {
        this.#id = id;
        this.name = name;
        this.image = image;
        this.teamAbbr = teamAbbr;
    }

    get id() {
        return this.#id;
    }

    getElement() {
        // return element if it's created already
        let elem = getElFromContentByID(this.#id);
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
        // if this card is currently selected, call with an empty object so it's deselected
        // otherwise call with this to select it
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
    teamAbbr;
    skins;

    constructor(id, name, categoryId, teamAbbr) {
        this.#id = id;
        this.name = name;
        this.categoryId = categoryId;
        this.teamAbbr = teamAbbr;
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
        let elem = getElFromContentByID(this.#id);
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
        // always call with this, as things can't be deselected
        updateWeapon(this);
    }
}

/**
 * A class representing a skin
 */
export class Skin {
    #id;
    name;
    image;
    weaponId;

    constructor(id, name, image, weaponId) {
        this.#id = id;
        this.name = name;
        this.image = image;
        this.weaponId = weaponId;
    }

    get id() {
        return this.#id;
    }

    getElement() {
        // return element if it's created already
        let elem = getElFromContentByID(this.#id);
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
        // always call with this, as deselection needs to be handled by the function
        // calling with an empty object resets all skin selections
        selectSkin(this);
    }
}