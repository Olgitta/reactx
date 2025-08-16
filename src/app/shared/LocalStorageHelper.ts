
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

    // /**
    //  * Updates an existing JSON object in localStorage by merging new properties.
    //  * If the item does not exist, it will be created with the provided updates.
    //  *
    //  * @param key The key of the item to update.
    //  * @param updates An object containing the properties to update.
    //  * @returns {boolean} True if the item was successfully updated/created, false otherwise.
    //  */
    // static updateItem<T>(key: string, updates: Partial<T>): boolean {
    //     try {
    //         console.log('updates', updates);
    //         const existingItem = LocalStorageHelper.getItem<T>(key);
    //         console.log('existingItem', existingItem);
    //         const newItem = {...(existingItem || {}), ...updates} as T;
    //         console.log('newItem', newItem);
    //         return LocalStorageHelper.saveItem(key, newItem);
    //     } catch (error) {
    //         console.error(`[LocalStorageHelper] Error updating item in localStorage under key "${key}":`, error);
    //         return false;
    //     }
    // }

    static updateSetOfT<T>(key: string, updates: T[]): T[] | null {
        try {
            // Получаем существующий массив. Если его нет, начинаем с пустого массива.
            const existingItems = LocalStorageHelper.getItem<T[]>(key) || [];

            // Конкатенируем новый массив, чтобы добавить элементы.
            // Заметь: это полностью перезаписывает старый массив, если ты хотел слить их
            // с уникальными ID, понадобится другая логика.
            const newItem = [...existingItems, ...updates];

            // Сохраняем обновлённый массив.
            if (LocalStorageHelper.saveItem(key, newItem)) {
                return newItem;
            }
            return null;
        } catch (error) {
            console.error(`[LocalStorageHelper] Error updating array in localStorage under key "${key}":`, error);
            return null;
        }
    }

    /**
     * Updates a Set of numbers stored in localStorage.
     * If the item does not exist, it will be created.
     *
     * @param key The key of the item to update.
     * @param newNumbers A Set or array of numbers to add to the existing set.
     * @returns {Set<number> | null} The updated Set, or null if an error occurred.
     */
    static updateSet(key: string, newNumbers: Set<number> | number[]): Set<number> | null {
        try {
            // Получаем существующий Set. Если его нет, создаём новый.
            // getItem возвращает null, если элемента нет.
            const existingSet = LocalStorageHelper.getItem<number[]>(key);
            const numbersSet = new Set<number>(existingSet || []);

            // Проходим по новым числам и добавляем их в Set.
            // Set автоматически обрабатывает уникальность.
            newNumbers.forEach(number => numbersSet.add(number));

            // Преобразуем Set обратно в массив для сохранения в localStorage.
            const numbersArray = Array.from(numbersSet);

            // Сохраняем обновлённый массив.
            if (LocalStorageHelper.saveItem(key, numbersArray)) {
                return numbersSet; // Возвращаем обновлённый Set.
            }
            return null;
        } catch (error) {
            console.error(`[LocalStorageHelper] Error updating Set in localStorage under key "${key}":`, error);
            return null;
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

}

export default LocalStorageHelper;
