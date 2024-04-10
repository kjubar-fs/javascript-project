/*
 *  Author: Kaleb Jubar
 *  Created: 9 Apr 2024, 3:17:00 PM
 *  Last update: 10 Apr 2024, 12:11:28 PM
 *  Copyright (c) 2024 Kaleb Jubar
 */
import { getElID, getElSlct, createEl } from "./utility.js";

const PAGES_ENUM = Object.freeze({
    startPage: 0,
    teamPage: 1,
    charPage: 2,
    weaponPage: 3,
    summPage: 4,
    teamSummPage: 5
});

let curPage = PAGES_ENUM.startPage;

// TODO: remove debug
console.log("main script initialized");

function createNav() {
    // make nav
    const navEl = createEl("nav", {
        id: "mainNav",
        className: "team-dark",
        innerHTML:
        `<hr id="breadcrumbDivider">
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
        // className: "hidden",
        innerHTML: `<img class="nav-icon cursor-pointer" src="/assets/images/icons/nav/teams-wh.png">`
    });
    navTeamEl.addEventListener("click", () => { navToPage(PAGES_ENUM.teamPage) });
    const navCharEl = createEl("li", {
        id: "navChar",
        // className: "hidden",
        innerHTML: `<img class="nav-icon cursor-pointer" src="/assets/images/icons/nav/soldier-wh.png">`
    });
    navCharEl.addEventListener("click", () => { navToPage(PAGES_ENUM.charPage) });
    const navWeaponEl = createEl("li", {
        id: "navWeapon",
        // className: "hidden",
        innerHTML: `<img class="nav-icon cursor-pointer" src="/assets/images/icons/nav/weapon-wh.png">`
    });
    navWeaponEl.addEventListener("click", () => { navToPage(PAGES_ENUM.weaponPage) });
    const navSummaryEl = createEl("li", {
        id: "navSummary",
        // className: "hidden",
        innerHTML: `<img class="nav-icon cursor-pointer" src="/assets/images/icons/nav/review-wh.png">`
    });
    navSummaryEl.addEventListener("click", () => { navToPage(PAGES_ENUM.summPage) });
    const navTeamSummaryEl = createEl("li", {
        id: "navTeamSummary",
        // className: "hidden",
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

const bodyEl = getElSlct("body");
bodyEl.appendChild(createNav());
// TODO: reenable this
// updateBreadcrumbs(curPage);

// TODO: remove debug
console.log("navbar created");

function createMain() {
    const mainEl = createEl("main", {
        id: "mainContent",
        className: "screen-1",
        innerHTML:
        `<h1 id="mainHeading">Counter-Strike Team Builder</h1>
        <div id="startBuilder" class="main-card card-button cursor-pointer"><h2>Start</h2></div>`
    });

    mainEl.lastChild.addEventListener("click", () => { navToPage(PAGES_ENUM.teamPage) });

    return mainEl;
}

bodyEl.appendChild(createMain());

function navToPage(pageNum) {
    // do nothing if we're already on the specified page
    if (curPage === pageNum) {
        return;
    }
    
    // TODO: remove debug
    console.log("navigating to page " + pageNum);

    // set the current page
    curPage = pageNum;

    // clear out the content div
    // this will be the only div on the page with the main-card CSS class (unless the user edits via F12)
    const contentDiv = getElSlct(".main-card");
    contentDiv.innerHTML = "";

    switch (pageNum) {
        case PAGES_ENUM.teamPage:
            contentDiv.id = "teamSelect";
            contentDiv.className = "main-card card-mid";
            createPageTeamSel(contentDiv);
            break;
        case PAGES_ENUM.charPage:
            contentDiv.id = "operatorSelect";
            contentDiv.className = "main-card card-lg";
            createPageCharSel(contentDiv);
            break;
        case PAGES_ENUM.weaponPage:
            contentDiv.id = "weaponSelect";
            contentDiv.className = "main-card card-lg";
            createPageWeaponSel(contentDiv);
            break;
        case PAGES_ENUM.summPage:
            contentDiv.id = "charSumm";
            contentDiv.className = "main-card card-lg";
            createPageCharSumm(contentDiv);
            break;
        case PAGES_ENUM.teamSummPage:
            contentDiv.id = "teamSumm";
            contentDiv.className = "main-card card-lg";
            createPageTeamSumm(contentDiv);
            break;
        // default to start page if this breaks somehow
        case PAGES_ENUM.startPage:
        default:
            contentDiv.id = "startBuilder";
            contentDiv.className = "main-card card-button cursor-pointer";
            createPageStart(contentDiv);
            break;
    }

    // TODO: reenable
    // updateBreadcrumbs(pageNum);
}

function updateBreadcrumbs(pageNum) {
    // get a list of which nav elements should be hidden
    let hideNavs;
    switch (pageNum) {
        case PAGES_ENUM.teamPage:
            getElID("breadcrumbDivider").classList.remove("hidden");
            hideNavs = ["navChar", "navWeapon", "navSummary", "navTeamSummary"];
            break;
        case PAGES_ENUM.charPage:
            getElID("breadcrumbDivider").classList.remove("hidden");
            hideNavs = ["navWeapon", "navSummary", "navTeamSummary"];
            break;
        case PAGES_ENUM.weaponPage:
            getElID("breadcrumbDivider").classList.remove("hidden");
            hideNavs = ["navSummary", "navTeamSummary"];
            break;
        case PAGES_ENUM.summPage:
            getElID("breadcrumbDivider").classList.remove("hidden");
            hideNavs = ["navTeamSummary"];
            break;
        case PAGES_ENUM.teamSummPage:
            getElID("breadcrumbDivider").classList.remove("hidden");
            hideNavs = [];
            break;
        // default to start page if this breaks somehow
        case PAGES_ENUM.startPage:
        default:
            getElID("breadcrumbDivider").classList.add("hidden");
            hideNavs = ["navTeam", "navChar", "navWeapon", "navSummary", "navTeamSummary"];
            break;
    }

    const crumbs = [ ...getElID("breadcrumbs").children ];
    crumbs.forEach(el => {
        hideNavs.includes(el.id) ? el.classList.add("hidden") : el.classList.remove("hidden");
    });
}

function createPageStart(contentDiv) {
    contentDiv.innerHTML = `<h2>Start</h2>`;
    contentDiv.addEventListener("click", () => { navToPage(PAGES_ENUM.teamPage) });
}

function createPageTeamSel(contentDiv) {

}

function createPageCharSel(contentDiv) {

}

function createPageWeaponSel(contentDiv) {

}

function createPageCharSumm(contentDiv) {

}

function createPageTeamSumm(contentDiv) {
    
}