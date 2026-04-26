/**
 * Merges static data from stores with newly registered data from localStorage
 * @param {Array} staticData - The original data from the store
 * @param {string} serviceType - "Tourism" or "Food"
 * @param {string} category - The category name (e.g., "Places", "Fine Dining")
 * @returns {Array} - Combined list of data
 */
export const getMergedData = (staticData, serviceType, category) => {
    try {
        const storageKey = serviceType === "Tourism" ? "registered_tourism_services" : "registered_food_services";
        const localData = JSON.parse(localStorage.getItem(storageKey) || "[]");

        // Filter local data by category
        const filteredLocal = localData.filter(item => item.category === category);

        // Return static data merged with local data (local first so it shows at start, or last)
        return [...staticData, ...filteredLocal];
    } catch (error) {
        console.error("Error merging data:", error);
        return staticData;
    }
};

/**
 * Gets all registered data for a service type without category filtering
 */
export const getFullMergedData = (staticData, serviceType) => {
    try {
        const storageKey = serviceType === "Tourism" ? "registered_tourism_services" : "registered_food_services";
        const localData = JSON.parse(localStorage.getItem(storageKey) || "[]");
        return [...staticData, ...localData];
    } catch (error) {
        return staticData;
    }
};

/**
 * Gets a single item by ID from combined data
 */
export const getSelectedItem = (staticData, serviceType, category, id) => {
    const combined = getMergedData(staticData, serviceType, category);
    return combined.find(item => String(item.id) === String(id));
};
