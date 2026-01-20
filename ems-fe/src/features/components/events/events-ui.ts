import type { Event as EventModel } from '@/features/types/events.';

type OpenCreateDetail = { type: 'create' };
type OpenEditDetail = { type: 'edit'; event: EventModel };
type EventDetail = OpenCreateDetail | OpenEditDetail;

const KEY = 'ems:open-event-modal';

export function openCreateEventModal() {
  window.dispatchEvent(new CustomEvent<EventDetail>(KEY, { detail: { type: 'create' } }));
}

export function openEditEventModal(event: EventModel) {
  window.dispatchEvent(new CustomEvent<EventDetail>(KEY, { detail: { type: 'edit', event } }));
}

export function subscribeToEventModal(handler: (detail: EventDetail) => void) {
  const listener: EventListener = (evt) => {
    const ce = evt as CustomEvent<EventDetail>;
    handler(ce.detail);
  };

  window.addEventListener(KEY, listener);
  return () => window.removeEventListener(KEY, listener);
}
