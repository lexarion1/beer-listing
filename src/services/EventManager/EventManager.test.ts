import { describe, it, expect, vi, afterEach } from 'vitest';
import { EventManager, EventName } from './EventManager';

describe('EventManager', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('dispatch', () => {
        it('should dispatch a custom event with the correct name and detail', () => {
            const dispatchEventSpy = vi.spyOn(document, 'dispatchEvent');
            const eventName: EventName = 'modal-open';
            const detail = { foo: 'bar' };

            EventManager.dispatch(eventName, detail);

            expect(dispatchEventSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: eventName,
                    detail,
                    bubbles: true,
                    composed: true,
                }),
            );
        });

        it('should dispatch a custom event without detail', () => {
            const dispatchEventSpy = vi.spyOn(document, 'dispatchEvent');
            const eventName: EventName = 'modal-close';

            EventManager.dispatch(eventName);

            expect(dispatchEventSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: eventName,
                    bubbles: true,
                    composed: true,
                }),
            );
        });
    });

    describe('subscribe', () => {
        it('should add an event listener and return an unsubscribe function', () => {
            const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
            const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
            const eventName: EventName = 'modal-open';
            const callback = vi.fn();

            const unsubscribe = EventManager.subscribe(eventName, callback);

            expect(addEventListenerSpy).toHaveBeenCalledWith(eventName, callback);

            unsubscribe();

            expect(removeEventListenerSpy).toHaveBeenCalledWith(eventName, callback);
        });

        it('should call the callback when the subscribed event is dispatched', () => {
            const eventName: EventName = 'modal-close';
            const callback = vi.fn();
            const detail = { test: 'data' };

            EventManager.subscribe(eventName, callback);
            EventManager.dispatch(eventName, detail);

            expect(callback).toHaveBeenCalledTimes(1);
            const callbackEvent = callback.mock.calls[0][0] as CustomEvent;
            expect(callbackEvent.type).toBe(eventName);
            expect(callbackEvent.detail).toEqual(detail);
        });
    });
});
