import { getSetting } from "../settings.js";

export function applyAutoMarkDead() {
  Hooks.on("dnd5e.damageActor", (actor) => {
    if (!getSetting("autoMarkDeadNPCs")) return;

    if (actor.type !== "npc") return;

    if (actor.system.traits.important) return;

    if (actor.system.attributes.hp.value > 0) return;

    if (!actor.inCombat) return;

    const isDead = actor.effects.some(e => e.statuses.has("dead"));
    if (!isDead) {
      actor.toggleStatusEffect("dead", { active: true, overlay: true });
    }
  });
}