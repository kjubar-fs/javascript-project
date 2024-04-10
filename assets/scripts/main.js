/*
 *  Author: Kaleb Jubar
 *  Created: 9 Apr 2024, 3:17:00 PM
 *  Last update: 10 Apr 2024, 4:08:43 PM
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
let curTeam = "";

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

    // update background image
    getElID("mainContent").className = `screen-${pageNum+1}`;

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
    // hide the divider for start page, otherwise show
    pageNum === PAGES_ENUM.startPage
        ? getElID("breadcrumbDivider").classList.add("hidden")
        : getElID("breadcrumbDivider").classList.remove("hidden");
    
    // get a list of which nav elements should be hidden
    let hideNavs;
    switch (pageNum) {
        case PAGES_ENUM.teamPage:
            hideNavs = ["navChar", "navWeapon", "navSummary", "navTeamSummary"];
            break;
        case PAGES_ENUM.charPage:
            hideNavs = ["navWeapon", "navSummary", "navTeamSummary"];
            break;
        case PAGES_ENUM.weaponPage:
            hideNavs = ["navSummary", "navTeamSummary"];
            break;
        case PAGES_ENUM.summPage:
            hideNavs = ["navTeamSummary"];
            break;
        case PAGES_ENUM.teamSummPage:
            hideNavs = [];
            break;
        // default to start page if this breaks somehow
        case PAGES_ENUM.startPage:
        default:
            hideNavs = ["navTeam", "navChar", "navWeapon", "navSummary", "navTeamSummary"];
            break;
    }

    // go over the list of breadcrumbs and show/hide as indicated by the current page
    // both Element.children and Element.childNodes are not proper arrays, so we have to use the spread operator to do a forEach
    const crumbs = [ ...getElID("breadcrumbs").children ];
    crumbs.forEach(el => {
        hideNavs.includes(el.id) ? el.classList.add("hidden") : el.classList.remove("hidden");
    });
}

function createPageStart(contentDiv) {
    // HTML for start page is basic and non-interactive, so just use innerHTML
    contentDiv.innerHTML = `<h2>Start</h2>`;

    // add a click listener to go to the next page
    contentDiv.addEventListener("click", () => { navToPage(PAGES_ENUM.teamPage) });
}

function createPageTeamSel(contentDiv) {
    // set up non-interactive elements
    contentDiv.innerHTML =`<h2>Select a Team</h2>`;

    /**
     * Creates a new team button, appends it to the given div, and returns
     * the created inner radio button for adding interactivity
     * @param {HTMLElement} contentDiv content div element to append to
     * @param {string} btnId id string
     * @param {string} label button label
     * @returns created input radio button
     */
    function createTeamBtn(contentDiv, btnId, label) {
        // create wrapper div
        let btnDiv = createEl("div", { className: "no-back-deco" });

        // create radio and label
        let radioEl = createEl("input", {
            id: btnId,
            type: "radio",
            name: "team"
        });
        let labelEl = createEl("label", {
            id: `${btnId}Btn`,
            className: "btn-large cursor-pointer",
            innerHTML: label    // label uses innerHTML for the text inside
        })
        labelEl.setAttribute("for", btnId); // "for" can't be set with dot notation

        // append children to wrapper, then wrapper to content
        btnDiv.appendChild(radioEl);
        btnDiv.appendChild(labelEl);
        contentDiv.appendChild(btnDiv);

        // return the radio element for interactivity
        return radioEl;
    }

    // add change listeners to radio buttons
    let ctRadio = createTeamBtn(contentDiv, "teamCT", "Counter-Terrorist");
    let tRadio = createTeamBtn(contentDiv, "teamT", "Terrorist");
    let autoRadio = createTeamBtn(contentDiv, "teamAuto", "Auto-Select");

    let updateTeam = (e) => {
        // parse the team name from the ID of the triggering component
        curTeam = e.target.id.split("team")[1].toUpperCase();
        // TODO: remove debug
        console.log(`team changed: ${curTeam}`);
    }
    
    ctRadio.addEventListener("change", updateTeam);
    tRadio.addEventListener("change", updateTeam);
    autoRadio.addEventListener("change", updateTeam);

    // create the next button
    let nextBtn = createEl("button", {
        id: "teamNext",
        className: "btn-small cursor-pointer",
        innerHTML: "Next"   // button also uses innerHTML
    });

    // add navigation on click
    nextBtn.addEventListener("click", () => { navToPage(PAGES_ENUM.charPage) });

    contentDiv.appendChild(nextBtn);
}

function createDisplayCard(clickable, imgPath, text) {
    let cardDiv = createEl("div", {
        // element needs cursor-pointer if it's intended to be clickable
        className: `display-card ${clickable ? "cursor-pointer" : ""}`,
        innerHTML: 
            `<img class="display-img" src="${imgPath}">
            <p class="display-text">${text}</p>`
    });

    return cardDiv;
}

function createPageCharSel(contentDiv) {
    // set up non-interactive elements
    contentDiv.innerHTML = `<h2>Select an Operator</h2>`;

    // create operator cards
    // TODO: replace this with data loaded from API
    let opListDiv = createEl("div", { id: "operatorList" });
    for (let i = 1; i < 12; i++) {
        opListDiv.appendChild(
            createDisplayCard(true, "/assets/images/logo.png", `Operator ${i}`)
        );
    }

    // create footer
    let opFooterDiv = createEl("div", {
        id: "operatorFooter",
        className: "footer",
        innerHTML:
            // this doesn't need interactivity since it is only accessed by validation functions later, so we'll add it via innerHTML
            `<input id="operatorName" name="operatorName" placeholder="Player Name">`
    });

    // create next button and set up handler
    let nextBtn = createEl("button", {
        id: "operatorNext",
        className: "next-btn btn-small team-light cursor-pointer",
        innerHTML: "Next"
    });

    nextBtn.addEventListener("click", () => { navToPage(PAGES_ENUM.weaponPage) });

    // add to footer
    opFooterDiv.appendChild(nextBtn);

    // add content to page
    contentDiv.appendChild(opListDiv);
    contentDiv.appendChild(opFooterDiv);
}

function createPageWeaponSel(contentDiv) {

}

function createPageCharSumm(contentDiv) {

}

function createPageTeamSumm(contentDiv) {
    
}