/*
 *  Author: Kaleb Jubar
 *  Created: 9 Apr 2024, 3:17:00 PM
 *  Last update: 9 Apr 2024, 3:32:03 PM
 *  Copyright (c) 2024 Kaleb Jubar
 */
import { getElID, getElSlct, createEl } from "./utility.js";

console.log("main script initialized");

const bodyEl = getElSlct("body");
const testHeader = createEl("h1", { id: "testHeader", innerText: "Added via JS" });
bodyEl.appendChild(testHeader);