/**
 * Safe JSON Parser
 * Safely parses JSON with error handling
 */

export const safeJsonParse = <T = any>(json: string): T | null => {
    try {
        return JSON.parse(json) as T;
    } catch (error) {
        return null;
    }
};
