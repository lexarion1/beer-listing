type EventsObject = typeof EventManager.EVENTS;

type ExtractStringValues<T> = T extends string
    ? T
    : T extends object
      ? { [K in keyof T]: ExtractStringValues<T[K]> }[keyof T]
      : never;

export type EventName = ExtractStringValues<EventsObject>;

export class EventManager {
    static EVENTS = {
        MODAL: {
            OPEN: 'modal-open',
            CLOSE: 'modal-close',
        },
    };

    static dispatch<D = unknown>(eventName: EventName, detail?: D) {
        const event = new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            detail,
        });
        document.dispatchEvent(event);
    }

    static subscribe<T = unknown>(eventName: EventName, callback: (event: CustomEvent<T>) => void) {
        document.addEventListener(eventName, callback as EventListener);

        return () => {
            document.removeEventListener(eventName, callback as EventListener);
        };
    }
}
