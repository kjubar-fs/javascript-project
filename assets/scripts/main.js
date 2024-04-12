/*
 *  Author: Kaleb Jubar
 *  Created: 9 Apr 2024, 3:17:00 PM
 *  Last update: 12 Apr 2024, 10:02:40 AM
 *  Copyright (c) 2024 Kaleb Jubar
 */
import { getElID, getElSlct, createEl } from "./utility.js";
import { Operator } from "./data_classes.js";
import { loadOperators, loadSkins } from "./data_loading.js";

// using Object.freeze creates an object whose properties and values cannot change
// closest you can get to having an enum in JS
const PAGES_ENUM = Object.freeze({
    startPage: 0,
    teamPage: 1,
    charPage: 2,
    weaponPage: 3,
    summPage: 4,
    teamSummPage: 5
});

const WEAPON_ICONS = Object.freeze({
    pistols: "pistol",
    rifles: "rifle",
    heavy: "heavy",
    smgs: "smg",
    knives: "knife",
    gloves: "gloves"
});

// pregenerate screen HTML
let startContent = createPageStart();
let teamSelContent = createPageTeamSel();
let charSelContent = createPageCharSel();
let weaponSelContent = createPageWeaponSel();
let charSummContent = createPageCharSumm();
let teamSummContent = createPageTeamSumm();

// preload data
let operators;
loadOperators().then((result) => {
    operators = result;
    populateOperatorCards();
});
// TODO: implement Weapon class
// dictionary index of weapons
// [id: string]:    weapon: Weapon
let weapons = {};
// dictionary index of weapon categories
// [id: string]:    name: string
let weaponCategories = {};
// dictionary index of weapons by category
// [categoryId: string]:    weaponId: string[]
let weaponsByCategory = {};
loadSkins(weapons, weaponCategories, weaponsByCategory).then(() => {
    // TODO: remove debug
    console.log(weapons);
    console.log(weaponCategories);
    console.log(weaponsByCategory);
    populateWeaponTabs();
    populateWeapons();
    populateSkins();
});

// selection storage
// TODO: empty array, only full for debug purposes
let visitedPages = [0, 1, 2, 3, 4, 5];
let curPage = -1;

let curTeam = "";
let curTeamName = "";

let curOperator = {};
let playerName = "";

let curWeapCategory = "";
let curWeap = {};
let selectedSkins = [];

// TODO: remove debug
console.log("main script initialized");

/**
 * Change the currently selected operator
 * @param {Operator} newOperator operator to change to
 */
export function updateOperator(newOperator) {
    // deselect previous operator
    // if curOperator is empty, there was nothing selected
    if (Object.keys(curOperator).length !== 0) {
        curOperator.getElement().classList.remove("selected");
        curOperator = newOperator;
        return;
    }

    // update current operator
    curOperator = newOperator;
    curOperator.getElement().classList.add("selected");
}

/**
 * Update the player's name
 * @param {string} newName new player name
 */
function updatePlayerName(newName) {
    playerName = newName;
}

/**
 * Switch currently active weapon category to filter display to
 * @param {string} newCategory weapon category to switch to
 */
function updateWeaponCategory(newCategory) {
    // do nothing if already on this category
    if (curWeapCategory === newCategory) {
        return;
    }

    // return if weapon list hasn't been populated (just in case)
    // or if the category doesn't exist
    if (Object.keys(weaponsByCategory).length === 0 || !weaponsByCategory[newCategory]) {
        return;
    }

    // hide weapons in the old category and deselect its tab, if there is one
    if (!!curWeapCategory) {
        weaponsByCategory[curWeapCategory].forEach((weaponName) => {
            const weapon = weapons[weaponName];
            weapon.getElement().classList.add("removed");
        });
        getElID(curWeapCategory).classList.remove("selected");
    }

    // show weapons in the new category and select its tab
    weaponsByCategory[newCategory].forEach((weaponName) => {
        const weapon = weapons[weaponName];
        weapon.getElement().classList.remove("removed");
    });
    getElID(newCategory).classList.add("selected");
    getElID("weaponList").scrollTop = 0;    // scroll weapon list to the top so it doesn't start randomly in the middle

    // select first weapon under new category automatically
    updateWeapon(weapons[getElSlct("#weaponList > div:not(.removed)").id]);

    // update the current weapon category
    curWeapCategory = newCategory;
}

/**
 * Change the currently selected weapon and update displayed skin list
 * @param {Weapon} newWeapon weapon to switch to
 */
export function updateWeapon(newWeapon) {
    // do nothing if already on this weapon
    if (curWeap === newWeapon) {
        return;
    }

    // hide skins for the old weapon and deselect its tab, if there is one
    if (Object.keys(curWeap).length !== 0) {
        curWeap.skins.forEach((skin) => {
            skin.getElement().classList.add("removed");
        });
        curWeap.getElement().classList.remove("selected");
    }

    // show skins for the new weapon and select its tab
    newWeapon.skins.forEach((skin) => {
        skin.getElement().classList.remove("removed");
    });
    newWeapon.getElement().classList.add("selected");
    getElID("weaponSkinList").scrollTop = 0;    // scroll skin list to the top so it doesn't start randomly in the middle

    // update the current weapon
    curWeap = newWeapon;
}

/**
 * Add or remove the given skin to/from the selected list
 * @param {Skin} newSkin skin to select or deselect, or {} to clear array
 */
export function selectSkin(newSkin) {
    // if we're provided an empty object, we just need to reset the skin selections
    if (Object.keys(newSkin).length === 0) {
        selectedSkins.forEach((skin) => {
            skin.getElement().classList.remove("selected");
        });
        selectedSkins.length = 0;
        return;
    }

    const skinEl = newSkin.getElement();
    // if the skin is selected, deselect it and remove it from the list
    if (skinEl.classList.contains("selected")) {
        skinEl.classList.remove("selected");
        let ix = selectedSkins.indexOf(newSkin);
        if (ix !== -1) {
            selectedSkins.splice(ix, 1);
        }

        // return early because we don't need to do anything else
        return;
    }

    // if the skin is not selected, a few things must happen
    // 1. check if another skin for the same weapon is selected
    //   if necessary:
    //   a. remove other skin from array
    //   b. deselect other skin
    // 2. add new skin to array
    // 3. select new skin
    // notably, we will not validate if the price exceeds the total
    // or whether or not we have at least one weapon from each category
    // that will happen when the user attempts to navigate away
    let filteredSkins = selectedSkins.filter((skin) => skin.weaponId === newSkin.weaponId);
    filteredSkins.forEach((skin) => {
        skin.getElement().classList.remove("selected");
        selectedSkins.splice(selectedSkins.indexOf(skin), 1);
    });

    newSkin.getElement().classList.add("selected");
    selectedSkins.push(newSkin);

    // TODO: remove debug
    console.log(selectedSkins);
}

const bodyEl = getElSlct("body");

/**
 * Assembles the navbar
 * @returns created top nav element
 */
function createNav() {
    // make nav
    const navEl = createEl("nav", {
        id: "mainNav",
        className: "team-dark",
        innerHTML:
            `<hr id="breadcrumbDivider" class="hidden">
            <ul id="breadcrumbs"></ul>`
    });
    
    // make logo and prepend to nav
    const logoEl = createEl("img", {
        id: "navLogo",
        className: "logo cursor-pointer",
        src: "/assets/images/logo-wh.png"
    });
    logoEl.addEventListener("click", () => { navToPage(PAGES_ENUM.startPage) });
    navEl.firstChild.insertAdjacentElement("beforebegin", logoEl);

    // make breadcrumbs and append to nav
    const navTeamEl = createEl("li", {
        id: "navTeam",
        className: "hidden",
        innerHTML: `<img class="nav-icon cursor-pointer" src="/assets/images/icons/nav/teams-wh.png">`
    });
    navTeamEl.addEventListener("click", () => { navToPage(PAGES_ENUM.teamPage) });
    const navCharEl = createEl("li", {
        id: "navChar",
        className: "hidden",
        innerHTML: `<img class="nav-icon cursor-pointer" src="/assets/images/icons/nav/soldier-wh.png">`
    });
    navCharEl.addEventListener("click", () => { navToPage(PAGES_ENUM.charPage) });
    const navWeaponEl = createEl("li", {
        id: "navWeapon",
        className: "hidden",
        innerHTML: `<img class="nav-icon cursor-pointer" src="/assets/images/icons/nav/weapon-wh.png">`
    });
    navWeaponEl.addEventListener("click", () => { navToPage(PAGES_ENUM.weaponPage) });
    const navSummaryEl = createEl("li", {
        id: "navSummary",
        className: "hidden",
        innerHTML: `<img class="nav-icon cursor-pointer" src="/assets/images/icons/nav/review-wh.png">`
    });
    navSummaryEl.addEventListener("click", () => { navToPage(PAGES_ENUM.summPage) });
    const navTeamSummaryEl = createEl("li", {
        id: "navTeamSummary",
        className: "hidden",
        innerHTML: `<img class="nav-icon cursor-pointer" src="/assets/images/icons/nav/squad-wh.png">`
    });
    navTeamSummaryEl.addEventListener("click", () => { navToPage(PAGES_ENUM.teamSummPage) });

    const navUlEl = navEl.lastChild;
    navUlEl.appendChild(navTeamEl);
    navUlEl.appendChild(navCharEl);
    navUlEl.appendChild(navWeaponEl);
    navUlEl.appendChild(navSummaryEl);
    navUlEl.appendChild(navTeamSummaryEl);

    return navEl;
}

bodyEl.appendChild(createNav());

// TODO: remove debug
console.log("navbar created");

/**
 * Creates the main content
 * @returns created top main element
 */
function createMain() {
    // create main
    const mainEl = createEl("main", {
        id: "mainContent",
        className: "screen-1",
        innerHTML:
            `<h1 id="mainHeading">Counter-Strike Team Builder</h1>
            <div class="main-card"></div>`
    });

    // set up the reset button, hidden by default
    const resetBtn = createEl("button", {
        id: "resetBtn",
        className: "danger cursor-pointer hidden",
        innerHTML: "Reset"
    });
    resetBtn.addEventListener("click", resetApplication);

    mainEl.appendChild(resetBtn);

    return mainEl;
}

bodyEl.appendChild(createMain());
// TODO: remove debug
console.log("main created");
navToPage(PAGES_ENUM.startPage);

/**
 * Navigates to the specified page
 * Does nothing if attempting to navigate to the current page
 * @param {PAGES_ENUM} pageNum page number to navigate to, from PAGES_ENUM
 */
function navToPage(pageNum) {
    // do nothing if we're already on the specified page
    if (curPage === pageNum) {
        return;
    }
    
    // TODO: remove debug
    console.log("navigating to page " + pageNum);

    // set the current page
    curPage = pageNum;

    // if this page hasn't been visited yet, record it as visited
    // TODO: update to false to dynamically update crumbs
    let needCrumbUpdate = true;
    if (!visitedPages.includes(pageNum)) {
        visitedPages.push(pageNum);
        needCrumbUpdate = true;
    }

    // update background image
    getElID("mainContent").className = `screen-${pageNum + 1}`;

    // show the reset button when we navigate away from the start page
    // also remove the click handler for the main div
    const contentDiv = getElSlct(".main-card");
    if (pageNum !== PAGES_ENUM.startPage) {
        getElID("resetBtn").classList.remove("hidden");
        contentDiv.removeEventListener("click", navToTeamSelect);
    }

    // clear out the content div
    // this will be the only div on the page with the main-card CSS class (unless the user edits via F12)
    contentDiv.innerHTML = "";
    let content;

    switch (pageNum) {
        case PAGES_ENUM.teamPage:
            document.title = "Team Select | CS:GO Team Builder";
            contentDiv.id = "teamSelect";
            contentDiv.className = "main-card card-mid";
            content = teamSelContent;
            break;
        case PAGES_ENUM.charPage:
            document.title = "Character Select | CS:GO Team Builder";
            contentDiv.id = "operatorSelect";
            contentDiv.className = "main-card card-lg";
            content = charSelContent;
            break;
        case PAGES_ENUM.weaponPage:
            document.title = "Weapon Select | CS:GO Team Builder";
            contentDiv.id = "weaponSelect";
            contentDiv.className = "main-card card-lg";
            content = weaponSelContent;
            break;
        case PAGES_ENUM.summPage:
            document.title = "Character Summary | CS:GO Team Builder";
            contentDiv.id = "charSumm";
            contentDiv.className = "main-card card-lg";
            content = charSummContent;
            break;
        case PAGES_ENUM.teamSummPage:
            document.title = "Team Summary | CS:GO Team Builder";
            contentDiv.id = "teamSumm";
            contentDiv.className = "main-card card-lg";
            content = teamSummContent;
            break;
        // default to start page if this breaks somehow
        case PAGES_ENUM.startPage:
        default:
            document.title = "Start Screen | CS:GO Team Builder";
            contentDiv.id = "startBuilder";
            contentDiv.className = "main-card card-button cursor-pointer";
            // add a click listener to go to the next page
            contentDiv.addEventListener("click", navToTeamSelect);
            content = startContent;
            break;
    }

    // apply content to div
    content.forEach((el) => {
        contentDiv.appendChild(el);
    });

    // if we're switching to the weapon select page and no weapon is currently selected, switch to the first one by default
    if (pageNum === PAGES_ENUM.weaponPage && !curWeapCategory) {
        updateWeaponCategory(getElSlct("#weaponChoices + div").id);
    }

    if (needCrumbUpdate) {
        updateBreadcrumbs();
    }
}

/**
 * Updates the breadcrumb display in the navbar based on visited pages
 */
function updateBreadcrumbs() {
    // show the divider if more than 1 page has been visited
    if (visitedPages.length > 1) {
        getElID("breadcrumbDivider").classList.remove("hidden");
    }

    // update the breadcrumbs based on which pages we've visited
    visitedPages.forEach((page) => {
        switch (page) {
            case PAGES_ENUM.teamPage:
                getElID("navTeam").classList.remove("hidden");
                break;
            case PAGES_ENUM.charPage:
                getElID("navChar").classList.remove("hidden");
                break;
            case PAGES_ENUM.weaponPage:
                getElID("navWeapon").classList.remove("hidden");
                break;
            case PAGES_ENUM.summPage:
                getElID("navSummary").classList.remove("hidden");
                break;
            case PAGES_ENUM.teamSummPage:
                getElID("navTeamSummary").classList.remove("hidden");
                break;
            // do nothing for start page or any other number we may end up with
            case PAGES_ENUM.startPage:
            default:
                break;
        }
    });
}

/**
 * Resets all application data and returns to the start screen
 */
function resetApplication() {
    // prompt for reset
    let shouldReset = confirm("Would you like to clear all data and restart?");
    if (!shouldReset) { return; }

    // TODO: remove debug
    console.log("application reset!");

    // hide reset button
    getElID("resetBtn").classList.add("hidden");

    // reset data
    updateSelectedTeam("", "");
    updateOperator({});
    updatePlayerName("");
    selectSkin({});

    // TODO: implement rest of reset (data, breadcrumbs, etc.)
    // visitedPages.length = 0;

    // navigate to home
    navToPage(PAGES_ENUM.startPage);
}

/**
 * Named wrapper for navigating to the team page
 * For use on the main page so we can remove the handler from the main content div
 */
function navToTeamSelect() {
    navToPage(PAGES_ENUM.teamPage);
}

/**
 * Create start page elements
 * @returns an array of elements to append to the main content div
 */
function createPageStart() {
    // TODO: remove debug
    console.log("creating start page");
    // empty content array
    let content = [];

    // set up non-interactive elements
    content.push(createEl("h2", { innerText: "Start" }));

    return content;
}

/**
 * Create team select page elements
 * @returns an array of elements to append to the main content div
 */
function createPageTeamSel() {
    // TODO: remove debug
    console.log("creating team select page");
    // empty content array
    let content = [];
    
    // set up non-interactive elements
    content.push(createEl("h2", { innerText: "Select a Team" }));

    // add change listeners to radio buttons
    const ctRadio = createTeamBtn("teamCT", "Counter-Terrorist");
    const tRadio = createTeamBtn("teamT", "Terrorist");
    const autoRadio = createTeamBtn("teamAuto", "Auto-Select");

    const updateTeam = (e) => {
        updateSelectedTeam(e.target.id.split("team")[1].toLowerCase(), e.target.value);
    }
    
    ctRadio.addEventListener("change", updateTeam);
    tRadio.addEventListener("change", updateTeam);
    autoRadio.addEventListener("change", updateTeam);

    // create the next button
    const nextBtn = createEl("button", {
        id: "teamNext",
        className: "btn-small cursor-pointer",
        innerHTML: "Next"   // button also uses innerHTML
    });

    // add navigation on click
    nextBtn.addEventListener("click", () => { navToPage(PAGES_ENUM.charPage) });

    content.push(nextBtn);

    return content;

    /// inner function ///

    /**
     * Creates a new team button, adds it to the content array, and returns
     * the created inner radio button for adding interactivity
     * @param {string} btnId id string
     * @param {string} label button label
     * @returns created input radio button
     */
    function createTeamBtn(btnId, label) {
        // create wrapper div
        const btnDiv = createEl("div", { className: "no-back-deco" });

        // create radio and label
        const radioEl = createEl("input", {
            id: btnId,
            type: "radio",
            name: "team"
        });
        radioEl.setAttribute("value", label);
        const labelEl = createEl("label", {
            id: `${btnId}Btn`,
            className: "btn-large cursor-pointer",
            innerHTML: label    // label uses innerHTML for the text inside
        })
        labelEl.setAttribute("for", btnId); // "for" can't be set with dot notation

        // append children to wrapper, then wrapper to content
        btnDiv.appendChild(radioEl);
        btnDiv.appendChild(labelEl);
        content.push(btnDiv);

        // return the radio element for interactivity
        return radioEl;
    }
}

/**
 * Given the team abbreviation and name, update appropriate data vars,
 * page header, team-specific styles, and navbar icon for character select
 * @param {string} teamAbbr team abbreviation, one of "ct", "t", or "auto"
 * @param {string} teamName team name in plain text
 */
function updateSelectedTeam(teamAbbr, teamName) {
    // update data vars
    curTeam = teamAbbr;
    curTeamName = teamName;
    
    // update header text and styles
    const header = getElID("mainHeading");
    if (!!curTeam && curTeam !== "auto") {
        header.innerText = header.innerText.split(":")[0] + `: ${curTeamName}`;
        bodyEl.className = `team-${curTeam}`;
    } else {
        header.innerText = "Counter-Strike Team Builder";
        bodyEl.className = "";
    }

    // update nav icon for char select
    const charIcon = getElSlct("#navChar > img");
    if (curTeam === "t") {
        charIcon.src = "/assets/images/icons/nav/terrorist-wh.png";
    } else {
        charIcon.src = "/assets/images/icons/nav/soldier-wh.png";
    }
    
    // TODO: remove debug
    console.log(`team changed: ${curTeam}`);
}

/**
 * Create a display card
 * @param {boolean} clickable true if this card has click interactivity
 * @param {string} imgPath src path for card's image
 * @param {string} text text to display in the card
 * @returns created card div
 */
// TODO: determine if export is necessary here
export function createDisplayCard(clickable, imgPath, text) {
    const cardDiv = createEl("div", {
        // element needs cursor-pointer if it's intended to be clickable
        className: `display-card ${clickable ? "cursor-pointer" : ""}`,
        innerHTML: 
            `<img class="display-img" src="${imgPath}">
            <p class="display-text">${text}</p>`
    });

    return cardDiv;
}

/**
 * Create character select page elements
 * @returns an array of elements to append to the main content div
 */
function createPageCharSel() {
    // TODO: remove debug
    console.log("creating character select page");
    // empty content array
    let content = [];

    // set up non-interactive elements
    content.push(createEl("h2", { innerText: "Select an Operator" }));

    // create operator list
    const opListDiv = createEl("div", { id: "operatorList" });
    // populating of cards will be handled by the data loading

    // create footer
    const opFooterDiv = createEl("div", {
        id: "operatorFooter",
        className: "footer"
    });

    const charNameInput = createEl("input", {
        id: "operatorName",
        name: "operatorName",
        placeholder: "Player Name"
    });
    charNameInput.addEventListener("input", (e) => {
        updatePlayerName(e.target.value);
    });
    opFooterDiv.appendChild(charNameInput);

    // create next button and set up handler
    const nextBtn = createEl("button", {
        id: "operatorNext",
        className: "next-btn btn-small team-light cursor-pointer",
        innerHTML: "Next"
    });
    nextBtn.addEventListener("click", () => { navToPage(PAGES_ENUM.weaponPage) });

    // add to footer
    opFooterDiv.appendChild(nextBtn);

    // add content to page
    content.push(opListDiv);
    content.push(opFooterDiv);

    return content;
}

/**
 * Populate the content of the operator list from the loaded data
 */
function populateOperatorCards() {
    // since this is called asynchronously, return if HTML elements haven't been created (just in case)
    if (!operators || !charSelContent) {
        return;
    }

    // add element for each operator
    const opListDiv = charSelContent.filter((el) => el.id === "operatorList")[0];
    operators.forEach((op) => {
        opListDiv.appendChild(op.getElement());
    });
}

/**
 * Create weapon select page elements
 * @returns an array of elements to append to the main content div
 */
function createPageWeaponSel() {
    // TODO: remove debug
    console.log("creating weapon select page");
    // empty content array
    let content = [];

    // set up non-interactive elements
    content.push(createEl("h2", { innerText: "Select Weapons and Gear" }));

    // create weapon selection
    const weapWrapDiv = createEl("div", {
        id: "weaponWrapper",
        className: "no-back-deco"
    });

    // create weapon and skin choices
    const choicesDiv = createEl("div", { id: "weaponChoices" });
    const weapListDiv = createEl("div", { id: "weaponList" });
    const skinListDiv = createEl("div", { id: "weaponSkinList" });

    choicesDiv.appendChild(weapListDiv);
    choicesDiv.appendChild(skinListDiv);
    weapWrapDiv.appendChild(choicesDiv);

    // create footer
    const weapFooterDiv = createEl("div", {
        id: "weaponFooter",
        className: "footer",
        // some of this content will be interactible, but only called from other places so we'll use innerHTML for now
        innerHTML:
            // TODO: remove selected skins from here
            `<div id="weaponBalance" class="no-back-deco">
                <p>Available balance: <span id="balanceNum" class="text-pos">$9000</span></p>
            </div>
            <div id="weaponSelections">
                <img class="selected-skin" src="/assets/images/logo.png">
                <img class="selected-skin" src="/assets/images/logo.png">
                <img class="selected-skin" src="/assets/images/logo.png">
                <img class="selected-skin" src="/assets/images/logo.png">
                <img class="selected-skin" src="/assets/images/logo.png">
                <img class="selected-skin" src="/assets/images/logo.png">
            </div>`
    });

    // create next button and set up handler
    const nextBtn = createEl("button", {
        id: "weaponNext",
        className: "next-btn btn-small team-light cursor-pointer",
        innerHTML: "Next"
    });

    nextBtn.addEventListener("click", () => { navToPage(PAGES_ENUM.summPage) });

    weapFooterDiv.appendChild(nextBtn);

    content.push(weapWrapDiv);
    content.push(weapFooterDiv);

    return content;
}

/**
 * Create a weapon tab with the given ID and icon
 * @param {string} tabId tab ID
 * @param {string} icon weapon icon filename (no path or extension)
 * @returns a div representing the created weapon tab
 */
function createWeaponTab(tabId, icon) {
    let imgPath = !!WEAPON_ICONS[icon] ?
        `/assets/images/icons/weapons/${WEAPON_ICONS[icon]}.png` :
        `/assets/images/icons/weapons/unknown.png`;
    const tabDiv = createEl("div", {
        id: tabId,
        className: "weapon-tab cursor-pointer",
        innerHTML: `<img class="nav-icon" src="${imgPath}">`
    });

    return tabDiv;
}

/**
 * Populate the content of the operator list from the loaded data
 */
function populateWeaponTabs() {
    // since this is called asynchronously, return if weapon list hasn't been populated (just in case)
    if (Object.keys(weaponCategories).length === 0) {
        return;
    }

    // add tab for each weapon category
    // can't use getElID here because this is before rendering the weapons page
    const weapWrapDiv = weaponSelContent.filter((el) => el.id === "weaponWrapper")[0];
    Object.keys(weaponCategories).forEach((catId) => {
        let catName = weaponCategories[catId];
        const tabDiv = createWeaponTab(catId, catName.toLowerCase());
        tabDiv.addEventListener("click", function() {
            updateWeaponCategory(this.id);
        }.bind(tabDiv));    // have to bind "this" to tabDiv, otherwise we get weirdness or errors
        weapWrapDiv.appendChild(tabDiv);
    });
}

/**
 * Populate the list of weapons from the loaded data
 */
function populateWeapons() {
    // since this is called asynchronously, return if weapon list hasn't been populated (just in case)
    if (Object.keys(weapons).length === 0) {
        return;
    }

    // add selector for each weapon
    // can't use getElID here because this is before rendering the weapons page
    const weapListDiv = weaponSelContent
                            .filter((el) => el.id === "weaponWrapper")[0]
                            .querySelector("#weaponList");
    Object.keys(weapons).forEach((id) => {
        const weaponElem = weapons[id].getElement();
        weaponElem.classList.add("removed");    // hide by default
        weapListDiv.appendChild(weaponElem);
    });
}

/**
 * Populate the list of skins from the loaded data
 */
function populateSkins() {
    // since this is called asynchronously, return if weapon list hasn't been populated (just in case)
    if (Object.keys(weapons).length === 0) {
        return;
    }

    // add card for each skin
    // can't use getElID here because this is before rendering the weapons page
    const skinListDiv = weaponSelContent
                            .filter((el) => el.id === "weaponWrapper")[0]
                            .querySelector("#weaponSkinList");
    Object.keys(weapons).forEach((id) => {
        weapons[id].skins.forEach((skin) => {
            const skinElem = skin.getElement();
            skinElem.classList.add("removed");  // hide by default
            skinListDiv.appendChild(skinElem);
        });
    });
}

/**
 * Create character summary page elements
 * @returns an array of elements to append to the main content div
 */
function createPageCharSumm() {
    // TODO: remove debug
    console.log("creating character summary page");
    // empty content array
    let content = [];
    
    // set up non-interactive elements
    content.push(createEl("h2", {
        id: "charSummName",
        innerText: "<your name here>"
    }));
    // TODO: update header contents with name

    // create main summary
    const charSummDiv = createEl("div", { id: "charSummDisplay" });

    // create operator display
    const charOpDiv = createEl("div", {
        id: "charSummOperator",
        className: "no-back-deco",
        // TODO: replace with operator image
        innerHTML: `<img src="/assets/images/logo.png">`
    });

    // create weapons display
    const charWeapDiv = createEl("div", {
        id: "charSummWeapons",
        className: "no-back-deco"
    });

    // TODO: replace with selected weapons
    for (let i = 1; i < 7; i++) {
        charWeapDiv.appendChild(
            createDisplayCard(false, "/assets/images/logo.png", `Weapon ${i}`)
        );
    }

    charSummDiv.appendChild(charOpDiv);
    charSummDiv.appendChild(charWeapDiv);

    // create footer
    const charFooter = createEl("div", {
        id: "charSummFooter",
        className: "footer",
        // same as with character select, interactibility on the field is set up elsewhere so we'll use innerHTML
        innerHTML: `<input id="charSummTeamName" name="charSummTeamName" placeholder="Team Name">`
    });

    // create next button and set up handler
    const nextBtn = createEl("button", {
        id: "charSummNext",
        className: "next-btn btn-small team-light cursor-pointer",
        innerHTML: "Next"
    });

    nextBtn.addEventListener("click", () => { navToPage(PAGES_ENUM.teamSummPage) });

    // add to footer
    charFooter.appendChild(nextBtn);
    
    // add content to page
    content.push(charSummDiv);
    content.push(charFooter);

    return content;
}

/**
 * Create team summary page elements
 * @returns an array of elements to append to the main content div
 */
function createPageTeamSumm() {
    // TODO: remove debug
    console.log("creating team summary page");
    // empty content array
    let content = [];
    
    // set up non-interactive elements
    content.push(createEl("h2", {
        id: "teamSummName",
        innerText: "<your team name here>"
    }));
    // TODO: update header contents with team name
    
    // create main summary
    const displayDiv = createEl("div", { id: "teamSummDisplay" });

    // create 4 operator cards
    // TODO: replace this with player and 3 randomly-generated operators
    for (let i = 1; i < 5; i++) {
        // create character container
        const charDiv = createEl("div", { className: "team-summ-char-details no-back-deco" });

        // create operator card
        const opDiv = createDisplayCard(false, "/assets/images/logo.png", `Operator ${i}`);
        // replace CSS classes on this card because this page uses special styles
        opDiv.className = "team-summ-operator display-card no-back-deco";

        // create weapon list
        const weaponsDiv = createEl("div", { className: "team-summ-weapons no-back-deco" });

        // create weapon cards and add to list
        for (let j = 1; j < 7; j++) {
            weaponsDiv.appendChild(
                createDisplayCard(false, "/assets/images/logo.png", `Weapon ${j}`)
            );
        }

        charDiv.appendChild(opDiv);
        charDiv.appendChild(weaponsDiv);

        displayDiv.appendChild(charDiv);
    }

    content.push(displayDiv);

    return content;
}