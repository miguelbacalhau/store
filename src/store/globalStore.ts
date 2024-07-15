type StoreEntry = { triggerChange?: () => void; data: unknown };

export const globalStore: Record<string, StoreEntry> = {};
