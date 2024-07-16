export type StoreEntry = {
  externals: {
    isLoading: boolean;
    data: null | unknown;
  };
  internals: {
    triggerChange: () => void;
  };
};

export const globalStore: Record<string, StoreEntry> = {};

export function initEntry(triggerChange: () => void) {
  return {
    externals: { data: null, isLoading: false },
    internals: { triggerChange },
  };
}
