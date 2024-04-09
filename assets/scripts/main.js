/*
 *  Author: Kaleb Jubar
 *  Created: 9 Apr 2024, 3:17:00 PM
 *  Last update: 9 Apr 2024, 3:51:51 PM
 *  Copyright (c) 2024 Kaleb Jubar
 */
import { getElID, getElSlct, createEl } from "./utility.js";

console.log("main script initialized");

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
    // TODO: implement navigation and hook up here
    //logoEl.addEventListener("click", navHome);
    navEl.firstChild.insertAdjacentElement("beforebegin", logoEl);

    // make breadcrumbs and append to nav
    const navTeamEl = createEl("li", {
        id: "navTeam",
        className: "hidden",
        innerHTML: `<img class="nav-icon cursor-pointer" src="/assets/images/icons/nav/teams-wh.png">`
    });
    // TODO: implement navigation and hook up here
    //navTeamEl.addEventListener("click", navTeam);
    const navCharEl = createEl("li", {
        id: "navChar",
        className: "hidden",
        innerHTML: `<img class="nav-icon cursor-pointer" src="/assets/images/icons/nav/soldier-wh.png">`
    });
    // TODO: implement navigation and hook up here
    //navCharEl.addEventListener("click", navChar);
    const navWeaponEl = createEl("li", {
        id: "navWeapon",
        className: "hidden",
        innerHTML: `<img class="nav-icon cursor-pointer" src="/assets/images/icons/nav/weapon-wh.png">`
    });
    // TODO: implement navigation and hook up here
    //navWeaponEl.addEventListener("click", navWeapon);
    const navSummaryEl = createEl("li", {
        id: "navSummary",
        className: "hidden",
        innerHTML: `<img class="nav-icon cursor-pointer" src="/assets/images/icons/nav/review-wh.png">`
    });
    // TODO: implement navigation and hook up here
    //navSummaryEl.addEventListener("click", navSummary);
    const navTeamSummaryEl = createEl("li", {
        id: "navTeamSummary",
        className: "hidden",
        innerHTML: `<img class="nav-icon cursor-pointer" src="/assets/images/icons/nav/squad-wh.png">`
    });
    // TODO: implement navigation and hook up here
    //navTeamSummaryEl.addEventListener("click", navTeamSummary);

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