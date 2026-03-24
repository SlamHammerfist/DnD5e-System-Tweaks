import { getSetting } from "../settings.js";

/**
 * Hiding the entire price column (header and rows) from Actor sheets for players.
 */
export function applyHidePrices(root, sheet) {
  if (!getSetting("hidePrices")) return;

  // 1. GM Check
  if (game.user.isGM) return;

  // 2. Normalize root
  const container = root instanceof jQuery ? root[0] : root;

  // 3. Grid Collapse (Essential for layout)
  if (container.style) {
    container.style.setProperty('--dnd5e-column-price-width', '0px');
  }

  // 4. Broad Selectors for v3 Sheets
  const priceSelectors = [
    // Header
    '.item-header[data-column-id="price"]', 
    '.item-header.item-price',
    
    // Row Columns (v3 specific)
    '.item-column[data-column-id="price"]',
    '.item-column.item-price',
    '.item-column.price',
    
    // Legacy/Alternative Row Classes
    '.item-list .item .item-price',
    '.item-list .item .price',
    
    // Totals/Footer
    '.currency .total-value',
    '.inventory-total .price',
    '.currency-item[data-currency="ep"]' // Just in case EP lingers
  ];

  // 5. Mass Removal
  container.querySelectorAll(priceSelectors.join(",")).forEach(el => {
    el.remove();
  });
}