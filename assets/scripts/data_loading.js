/*
 *  Author: Kaleb Jubar
 *  Created: 11 Apr 2024, 11:25:07 AM
 *  Last update: 12 Apr 2024, 11:33:21 AM
 *  Copyright (c) 2024 Kaleb Jubar
 */

/**
 * Data methods for loading from the API and formatting results
 */

import { Operator, Weapon, Skin } from "./data_classes.js";

const CSGO_OPERATORS_API = "https://bymykel.github.io/CSGO-API/api/en/agents.json";
const CSGO_SKINS_API = "https://bymykel.github.io/CSGO-API/api/en/skins.json";

/**
 * Fetches the list of operators from the API and formats them into objects
 * @returns loaded list of Operator objects
 */
export async function loadOperators() {
    let apiResults;

    // query the API
    await fetch(CSGO_OPERATORS_API)
        .then((resp) => resp.json())
        .then((results) => {
            apiResults = results;
        })
        .catch((reason) => console.log(`Error loading operators: ${reason}`));

    // map results into Operator objects
    let operators = [];

    apiResults.forEach((op) => {
        operators.push(new Operator(
            op.id,
            op.name.split("|")[0].trim(),   // use only first part of name, part after | is organization name
            op.image,
            op.team.id === "terrorists" ? "t" : "ct"    // no operator is available to both teams, so just use "t" or "ct"
        ));
    });

    return operators;
}

/**
 * Fetches the list of skins from the API, formats them into objects,
 * and parses the results into indexes on the provided objects
 * @param {Object} weapons weapon list
 * @param {Object} weaponCategories weapon category list
 * @param {Object} weaponsByCategory weapon to category index
 */
export async function loadSkins(weapons, weaponCategories, weaponsByCategory) {
    let apiResults = [];

    await fetch(CSGO_SKINS_API)
        .then((resp) => resp.json())
        .then((results) => {
            apiResults = results;
        })
        .catch((reason) => console.log(`Error: ${reason}`));

    // create indexes, mapping results to Weapon and Skin objects
    apiResults.forEach(weaponRaw => {
        // the taser has no weapon category so we'll omit it entirely to save complexity later
        if (!weaponRaw.category.id) {
            return;
        }

        // each knife has an alternate variant with the same name and a single skin
        // these are inconsistent with the other weapons and clutter the UI, so we'll skip those
        // the weapon ID for these begin with "sfui_wpnhud" and, as of writing this code,
        // there are no other weapons that start with the same prefix that we'd want to keep in
        if (weaponRaw.weapon.id.startsWith("sfui_wpnhud")) {
            return;
        }

        // index weapon data
        let weapon;
        if (!weapons[weaponRaw.weapon.id]) {
            weapon = new Weapon(
                weaponRaw.weapon.id,
                weaponRaw.weapon.name,
                weaponRaw.category.id,
                weaponRaw.team.id
            );
            
            weapons[weapon.id] = weapon;
        } else {
            weapon = weapons[weaponRaw.weapon.id];
        }

        // index weapon category ID
        if (!weaponCategories[weapon.categoryId]) {
            weaponCategories[weapon.categoryId] = weaponRaw.category.name;
        }

        // index weapons by category
        if (!weaponsByCategory[weapon.categoryId]) {
            weaponsByCategory[weapon.categoryId] = [];
            weaponsByCategory[weapon.categoryId].push(weapon.id);
        } else if (!weaponsByCategory[weapon.categoryId].some(el => el === weapon.id)) {
            weaponsByCategory[weapon.categoryId].push(weapon.id);
        }

        // index specific skin
        // a few skins aren't formatted "<weapon> | <skin>" so just fall back to full name
        let weaponName = 
            weaponRaw.name.includes("|") ?
            weaponRaw.name.split("|")[1].trim() :
            weaponRaw.name;
        weapon.skins.push(
            new Skin(
                weaponRaw.id,
                weaponName,
                weaponRaw.image,
                weapon.id
            )
        );
    });
}