/*
 *  Author: Kaleb Jubar
 *  Created: 11 Apr 2024, 11:25:07 AM
 *  Last update: 11 Apr 2024, 11:39:42 AM
 *  Copyright (c) 2024 Kaleb Jubar
 */

/**
 * Data methods for loading from the API and formatting results
 */

import { Operator } from "./data_classes.js";

const CSGO_OPERATORS_API = "https://bymykel.github.io/CSGO-API/api/en/agents.json";

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
        operators.push(new Operator(op.id, op.name.split("|")[0].trim(), op.image));
    });

    return operators;
}