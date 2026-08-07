// plannerAnnouncements.ts — dnd-kit screen-reader announcements that speak the
// SEMANTIC position ("moved before Standup, 2nd in Tuesday morning"), never raw
// indices (Felix 02 §3.4 / contract a11y requirement).
//
// dnd-kit calls these with { active, over } DnD ids. We translate an over-id +
// lane context into prose by looking up neighbor card titles. The lookup is a
// function injected by PlannerView (which holds the live lane model), so this
// module stays pure and the announcements always reflect current state.

import type { Announcements, UniqueIdentifier } from '@dnd-kit/core';
import { translateNow } from './i18n';

// Context the announcer needs to turn ids into prose. Provided by PlannerView.
export interface AnnounceContext {
  // Human title of a draggable (task or meeting) by its dnd id.
  titleOf: (id: UniqueIdentifier) => string;
  // A semantic phrase for where `activeId` currently sits relative to `overId`,
  // e.g. "before Standup, 2nd in Tuesday morning" or "in Wednesday afternoon, last".
  positionPhrase: (activeId: UniqueIdentifier, overId: UniqueIdentifier | null) => string;
  // True when dropping over `overId` resolves to NO lane (the sidebar / unschedule
  // region) — the SAME condition onDragEnd uses to fire the DELETE (H2). The
  // announcer reads "Unscheduled <title>." instead of the malformed
  // "Dropped <title> is over the sidebar to unschedule."
  isUnscheduleTarget: (activeId: UniqueIdentifier, overId: UniqueIdentifier | null) => boolean;
}

export function buildAnnouncements(ctx: AnnounceContext): Announcements {
  return {
    onDragStart({ active }) {
      return translateNow('planner.annPickedUp', { title: ctx.titleOf(active.id) });
    },
    onDragOver({ active, over }) {
      if (!over) return translateNow('planner.annNotOverLane', { title: ctx.titleOf(active.id) });
      if (ctx.isUnscheduleTarget(active.id, over.id)) {
        return translateNow('planner.annOverSidebar', { title: ctx.titleOf(active.id) });
      }
      return translateNow('planner.annOver', {
        title: ctx.titleOf(active.id),
        phrase: ctx.positionPhrase(active.id, over.id),
      });
    },
    onDragEnd({ active, over }) {
      if (!over) return translateNow('planner.annReturned', { title: ctx.titleOf(active.id) });
      if (ctx.isUnscheduleTarget(active.id, over.id)) {
        return translateNow('planner.annUnscheduled', { title: ctx.titleOf(active.id) });
      }
      return translateNow('planner.annDropped', {
        title: ctx.titleOf(active.id),
        phrase: ctx.positionPhrase(active.id, over.id),
      });
    },
    onDragCancel({ active }) {
      return translateNow('planner.annCancelled', { title: ctx.titleOf(active.id) });
    },
  };
}
