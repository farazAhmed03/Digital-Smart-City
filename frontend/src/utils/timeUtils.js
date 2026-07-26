/**
 * Checks if a restaurant is currently open based on its timing string.
 * @param {string} timingStr - Example: "10:00 AM - 11:00 PM", "24 Hours", "6:00 PM – 2:00 AM"
 * @returns {boolean}
 */
export const isCurrentlyOpen = (timingStr) => {
    if (!timingStr || typeof timingStr !== 'string') return false;

    const lowerStr = timingStr.toLowerCase().trim();
    
    // Quick checks for common non-standard strings
    if (lowerStr.includes("24 hours") || lowerStr.includes("always open") || lowerStr.includes("24/7")) {
        return true;
    }
    if (lowerStr.includes("closed") || lowerStr === "n/a") {
        return false;
    }
    if (lowerStr === "contact for timings") {
        return true; // Assume open if specified as such to avoid blocking
    }

    // Normalize separators: hyphen (-), en-dash (–), em-dash (—), or "to"
    const separators = ["-", "–", "—", " to "];
    let parts = [];
    for (const sep of separators) {
        if (timingStr.includes(sep)) {
            parts = timingStr.split(sep).map(p => p.trim());
            break;
        }
    }

    // If we couldn't find a separator, we can't reliably parse it range-wise
    if (parts.length < 2) return true;

    const parseTime = (timeStr) => {
        // Match numbers and AM/PM
        const match = timeStr.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
        if (!match) return null;
        
        let hours = parseInt(match[1]);
        let minutes = parseInt(match[2] || "0");
        const ampm = match[3].toUpperCase();

        if (ampm === "PM" && hours < 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;
        
        return hours * 60 + minutes; // Total minutes from midnight
    };

    const startMinutes = parseTime(parts[0]);
    const endMinutes = parseTime(parts[1]);

    // If parsing fails for either side, default to true to avoid frustration
    if (startMinutes === null || endMinutes === null) return true;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (startMinutes < endMinutes) {
        // Standard range (e.g., 9:00 AM to 10:00 PM)
        return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
        // Overnight range (e.g., 8:00 PM to 2:00 AM)
        return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }
};
