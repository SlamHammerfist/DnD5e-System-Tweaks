export const MODULE_ID = "dnd-system-tweaks";

export function registerSettings() {

  game.settings.register(MODULE_ID, "autoMarkDeadNPCs", {
    name: "Auto-Mark Dead NPCs",
    hint: "Automatically applies the Dead status effect to non-important NPCs when they reach 0 HP during combat.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, "hidePrices", {
    name: "Hide Prices (Players)",
    hint: "Completely hides item prices on all actor sheets (Character, NPC, Container) for players.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "removeElectrum", {
    name: "Remove Electrum",
    hint: "Hides electrum currency from character sheets.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "containerItemRolls", {
    name: "Container Item Rolls",
    hint: "Enables rolling consumable items directly from container sheets.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });
  
  game.settings.register(MODULE_ID, "disableItemTooltips", {
    name: "Disable Item Tooltips",
    hint: "Removes the DnD5e hover tooltips from items on character sheets.",
    scope: "client",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, "enableJournalTab", {
    name: "Enable Journal Tab",
    hint: "Adds a simple journal tab to character sheets.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "headerCollapse", {
    name: "Header Collapse",
    hint: "Adds collapse/expand toggles to item section headers.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "itemNameExpands", {
    name: "Item Name Expands",
    hint: "Clicking an item name expands or collapses its details directly on the sheet.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

}

export function getSetting(key) {
  return game.settings.get(MODULE_ID, key);
}