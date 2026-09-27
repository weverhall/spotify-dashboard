export const getTodayDateUTC = (): string => new Date().toISOString().slice(0, 10);
