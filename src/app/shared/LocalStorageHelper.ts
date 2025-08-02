import {Seat} from '../features/booking/types';

const LOCKED_SEATS_KEY = 'locked_seats';
const GUEST_ID_KEY = 'guest_id';

/**
 * A utility class for safely interacting with localStorage to store and retrieve JSON objects.
 * It handles serialization/deserialization and provides basic error handling.
 */
class LocalStorageHelper {
    /**
     * Saves a JSON object to localStorage under a specified key.
     * The object will be stringified before saving.
     *
     * @param key The key under which to store the item.
     * @param item The JavaScript object to store.
     * @returns {boolean} True if the item was successfully saved, false otherwise.
     */
    static saveItem<T>(key: string, item: T): boolean {
        try {
            const serializedItem = JSON.stringify(item);
            localStorage.setItem(key, serializedItem);
            return true;
        } catch (error) {
            console.error(`[LocalStorageHelper] Error saving item to localStorage under key "${key}":`, error);
            // This could be due to storage limits, security settings, etc.
            return false;
        }
    }

    /**
     * Retrieves a JSON object from localStorage under a specified key.
     * The stored string will be parsed back into an object.
     *
     * @param key The key of the item to retrieve.
     * @returns {T | null} The retrieved JavaScript object, or null if not found or an error occurred.
     */
    static getItem<T>(key: string): T | null {
        try {
            const serializedItem = localStorage.getItem(key);
            if (serializedItem === null) {
                return null; // Item not found
            }
            return JSON.parse(serializedItem) as T;
        } catch (error) {
            console.error(`[LocalStorageHelper] Error retrieving or parsing item from localStorage under key "${key}":`, error);
            // This could be due to malformed JSON, security settings, etc.
            return null;
        }
    }

    /**
     * Updates an existing JSON object in localStorage by merging new properties.
     * If the item does not exist, it will be created with the provided updates.
     *
     * @param key The key of the item to update.
     * @param updates An object containing the properties to update.
     * @returns {boolean} True if the item was successfully updated/created, false otherwise.
     */
    static updateItem<T>(key: string, updates: Partial<T>): boolean {
        try {
            const existingItem = LocalStorageHelper.getItem<T>(key);
            const newItem = {...(existingItem || {}), ...updates} as T;
            return LocalStorageHelper.saveItem(key, newItem);
        } catch (error) {
            console.error(`[LocalStorageHelper] Error updating item in localStorage under key "${key}":`, error);
            return false;
        }
    }

    /**
     * Deletes an item from localStorage under a specified key.
     *
     * @param key The key of the item to delete.
     * @returns {boolean} True if the item was successfully deleted, false otherwise.
     */
    static deleteItem(key: string): boolean {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`[LocalStorageHelper] Error deleting item from localStorage under key "${key}":`, error);
            return false;
        }
    }

    /**
     * Clears all items from localStorage. Use with caution!
     *
     * @returns {boolean} True if localStorage was successfully cleared, false otherwise.
     */
    static clearAll(): boolean {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('[LocalStorageHelper] Error clearing all items from localStorage:', error);
            return false;
        }
    }

    static isGuest(id:string): boolean {
        return localStorage.getItem(GUEST_ID_KEY) === id;
    }

    static saveLockedSeat(id: string, payload: Seat) {

        if(!this.isGuest(id)) {
            console.error('[LocalStorageHelper] Error saving lockedSeat: Guest is not Guest');
            return;
        }

        let list = this.getItem<Seat[]>(LOCKED_SEATS_KEY);
        if (!list) {
            list = [];
        }

        list.push(payload);
        this.saveItem(LOCKED_SEATS_KEY, list);
    }

    static removeLockedSeat(id: string, payload: Seat) {

        if(!this.isGuest(id)) {
            console.error('[LocalStorageHelper] Error removing lockedSeat: Guest is not Guest');
            return;
        }

        const list = this.getItem<Seat[]>(LOCKED_SEATS_KEY);
        if (!list) {
            console.warn('[LocalStorageHelper] Error deleting lockedSeats under key ', payload);
            return;
        }

        const updatedList = list.filter(
            (seat) => !(seat.rowNumber === payload.rowNumber && seat.seatNumber === payload.seatNumber)
        );

        this.saveItem(LOCKED_SEATS_KEY, updatedList);
    }

    static removeLockedSeats(): Seat[] | null {
        const list = this.getItem<Seat[]>(LOCKED_SEATS_KEY);
        this.deleteItem(LOCKED_SEATS_KEY);

        return list;
    }

    static saveGuestId(id: string) {
        localStorage.setItem(GUEST_ID_KEY, id);
    }
}

export default LocalStorageHelper;
