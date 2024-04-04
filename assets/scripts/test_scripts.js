/*
 *  Author: Kaleb Jubar
 *  Created: 19 Mar 2024, 7:20:40 PM
 *  Last update: 2 Apr 2024, 4:16:35 PM
 *  Copyright (c) 2024 Kaleb Jubar
 */

// TODO: remove console.logs

let getID = (id) => document.getElementById(id);

class Operator {
    name;
    icon;
    #id;

    getElement() {
        // return element if it's created already
        let elem = getID(this.#id);
        if (!!elem) {
            return elem;
        }
        
        // otherwise create and set it up
        elem = document.createElement("div");
        elem.id = this.#id;
        elem.className = "card operator-card";
        elem.innerHTML = `
            <h3>${this.name}</h3>
            <img src="${this.icon}">`;
        elem.addEventListener("click", this.#click.bind(this));

        return elem;
    }

    #click() {
        console.log(this.name);
        this.getElement().lastChild.classList.toggle("hidden");
    }
}

let opData = {
    name: "Billy Bob",
    icon: "assets/images/bgs/dust2.jpg"
};

let newOp = new Operator();
Object.assign(newOp, opData);
console.log(newOp);

document.querySelector(".logo").addEventListener("click", () => {
    console.log("adding new operator...");
    document.getElementById("startBuilder").appendChild(newOp.getElement());
});

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