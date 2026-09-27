export const getTodayDate = (): string => new Date().toISOString().slice(0, 10);
