import { getSetting } from "../settings.js";

let activeTabRecord = new Map();

export async function applyJournalTab(root, sheet) {
    if (!getSetting("enableJournalTab")) return;

    const existingTab = root.querySelector('.tab[data-tab="journal-tab"]');
    const existingNav = root.querySelector('.item[data-tab="journal-tab"]');
    if (existingTab) existingTab.remove();
    if (existingNav) existingNav.remove();

    const { TextEditor } = foundry.applications?.ux || {};
    const renderTemplate = foundry.applications?.handlebars?.renderTemplate;

    const nav = root.querySelector('.tabs[data-group="primary"]') || root.querySelector('nav.sheet-navigation');
    const tabContainer = root.querySelector('.main-content .tab-body') || root.querySelector('.tab-body');
    if (!nav || !tabContainer) return;

    const journalContent = sheet.actor.getFlag('dnd-system-tweaks', 'journal') || '';
    const isSheetEditable = root.classList.contains("editable") || root.closest(".editable") !== null;
    const isEditing = sheet.isEditable && isSheetEditable;

    const htmlString = await renderTemplate("modules/dnd-system-tweaks/templates/journal-tab.hbs", {});
    tabContainer.insertAdjacentHTML('beforeend', htmlString);
    
    const tabSection = tabContainer.querySelector('.tab[data-tab="journal-tab"]');
    const editorWrapper = tabSection.querySelector('.editor-container');

    if (isEditing) {
        const editor = document.createElement("prose-mirror");
        editor.setAttribute("name", "flags.dnd-system-tweaks.journal");
        editor.setAttribute("data-document-u-u-i-d", sheet.actor.uuid);
        editor.classList.add("editor", "prosemirror", "active");
        editor.setAttribute("toggled", "true");
        editor.setAttribute("collaborate", "true");
        editor.setAttribute("open", "");
        editor.value = journalContent;
        
        editorWrapper.appendChild(editor);

        if (typeof editor.activate === "function") {
            setTimeout(async () => { await editor.activate(); }, 25);
        }
    } else {
        const enriched = await TextEditor.enrichHTML(journalContent, {
            secrets: sheet.actor.isOwner,
            async: true,
            relativeTo: sheet.actor
        });

        editorWrapper.innerHTML = `
            <div class="editor">
                <div class="editor-content ProseMirror">${enriched}</div>
            </div>
        `;
    }

    const navItem = document.createElement("a");
    navItem.classList.add("item");
    navItem.dataset.tab = "journal-tab";
    navItem.dataset.group = "primary";
    navItem.innerHTML = `<i class="fas fa-file"></i>`;
    nav.appendChild(navItem);

    const wasActive = activeTabRecord.get(sheet.actor.uuid) === "journal-tab";
    if (wasActive) {
        nav.querySelectorAll('.item').forEach(el => el.classList.remove('active'));
        tabContainer.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
        navItem.classList.add('active');
        tabSection.classList.add('active');
        
        const abilityScores = root.querySelector('.ability-scores');
        if (abilityScores) abilityScores.style.display = "none";
    }

    navItem.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        
        nav.querySelectorAll('.item').forEach(el => el.classList.remove('active'));
        tabContainer.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
        
        navItem.classList.add('active');
        tabSection.classList.add('active');
        activeTabRecord.set(sheet.actor.uuid, "journal-tab");

        const abilityScores = root.querySelector('.ability-scores');
        if (abilityScores) abilityScores.style.display = "none";
    }, true);

    nav.querySelectorAll('.item:not([data-tab="journal-tab"])').forEach(otherBtn => {
        otherBtn.addEventListener("click", () => {
            activeTabRecord.set(sheet.actor.uuid, otherBtn.dataset.tab);
            const abilityScores = root.querySelector('.ability-scores');
            if (abilityScores) abilityScores.style.display = "";
            
            navItem.classList.remove('active');
            tabSection.classList.remove('active');
            sheet.render(false); 
        });
    });
}