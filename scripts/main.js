import { registerSettings } from "./settings.js";
import { applyAutoMarkDead } from "./features/autoMarkDead.js";
import { applyContainerItemRolls } from "./features/containerRolls.js";
import { applyHeaderCollapse } from "./features/headerCollapse.js";
import { applyHidePrices } from "./features/hidePrices.js";
import { applyItemNameExpand } from "./features/itemNameExpand.js";
import { applyJournalTab } from "./features/journalTab.js";
import { applyRemoveElectrum } from "./features/removeElectrum.js";
import { applyTooltipDisabling } from "./features/tooltips.js";

const OPEN_SHEETS = new Set();

Hooks.once("init", () => {
  registerSettings();
  applyAutoMarkDead();
  // Chat Card Merge removed from here
});

/**
 * Global initialization for features that don't depend on specific sheets.
 */
Hooks.once("ready", () => {
  // Triggers the UI-independent part of Electrum removal (like CONFIG deletion)
  applyRemoveElectrum(document.body);
});

/**
 * Runs all UI-based features on a specific root element.
 */
async function applyAllFeatures(root, sheet) {
  applyTooltipDisabling(root);
  applyItemNameExpand(root);
  applyHeaderCollapse(root);
  applyHidePrices(root, sheet);
  applyRemoveElectrum(root);
  await applyJournalTab(root, sheet);
}

const SHEET_HOOKS = [
  "renderCharacterActorSheet",
  "renderNPCActorSheet",
  "renderVehicleActorSheet",
  "renderEncounterActorSheet",
  "renderContainerSheet"
];

for (const hook of SHEET_HOOKS) {
  Hooks.on(hook, (sheet, html) => {
    OPEN_SHEETS.add(sheet);
    const root = html instanceof jQuery ? html[0] : html;

    applyAllFeatures(root, sheet);
    applyContainerItemRolls(root, sheet);
  });
}

// Clean up references when sheets close
Hooks.on("closeCharacterActorSheet", sheet => {
  OPEN_SHEETS.delete(sheet);
});

// Refresh open sheets when settings change
Hooks.on("closeSettingsConfig", () => {
  for (const sheet of OPEN_SHEETS) {
    const actor = sheet.actor;
    sheet.close();
    actor.sheet?.render(true);
  }
});