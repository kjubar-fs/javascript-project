/*
 *  Author: Kaleb Jubar
 *  Created: 19 Mar 2024, 7:20:40 PM
 *  Last update: 11 Apr 2024, 11:37:13 AM
 *  Copyright (c) 2024 Kaleb Jubar
 */
const CSGO_SKINS_API = "https://bymykel.github.io/CSGO-API/api/en/skins.json";
// response from API, list of objects representing skins
let apiSkinsResults = [];
// dictionary index of weapon categories
// [id: string]:    name: string
let weaponCategories = {};
// TODO: implement Weapon class
// dictionary index of weapons
// [id: string]:    weapon: Weapon
let weapons = {};
// dictionary index of weapons by category
// [categoryId: string]:    weaponId: string[]
let weaponsByCategory = {};

async function getSkins() {
    await fetch(CSGO_SKINS_API)
        .then((resp) => resp.json())
        .then((results) => {
            apiSkinsResults = results;
        })
        .catch((reason) => console.log(`Error: ${reason}`));
    indexWeapons();
}
function indexWeapons() {
    console.log(apiSkinsResults[0]);
    apiSkinsResults.forEach(weaponRaw => {
        // the taser has no weapon category so we'll omit it entirely to save complexity later
        if (!weaponRaw.category.id) {
            return;
        }

        // index weapon data
        // TODO: replace this with Weapon class when created
        let weapon = {};
        if (!weapons[weaponRaw.weapon.id]) {
            weapon = {
                id: weaponRaw.weapon.id,
                name: weaponRaw.weapon.name,
                categoryId: weaponRaw.category.id,
                teamId: weaponRaw.team.id,
                skins: []
            };
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
        /* TODO: implement Skin class and this logic, remove statement below
         *  pseudocode:
         *      create new skin object
         *      add skin to skins dictionary, indexed on skin id
         *      add skin id to array in corresponding weapon object in weapons array
         */
        weapon.skins.push(weaponRaw.id);
    });
    console.log(weaponCategories);
    console.log(weapons);
    console.log(weaponsByCategory);
    apiSkinsResults = [];
}
getSkins();

const CSGO_OPERATORS_API = "https://bymykel.github.io/CSGO-API/api/en/agents.json";
let apiOperatorsResults = [];
async function getOperators() {
    await fetch(CSGO_OPERATORS_API)
        .then((resp) => resp.json())
        .then((results) => {
            apiOperatorsResults = results;
        })
        .catch((reason) => console.log(`Error: ${reason}`));
    // console.log(apiOperatorsResults.filter(agent => agent.name.includes("Darryl")));
    apiOperatorsResults = [];
}
getOperators();