export type StoreEntry<TData = unknown> = {
  externals: {
    isLoading: boolean;
    data: null | TData;
  };
  internals: {
    fetched: boolean;
    triggerChange: () => void;
  };
};

export const globalStore: Record<string, StoreEntry> = {};

export function initEntry(key: string, triggerChange: () => void) {
  const entry = globalStore[key];

  if (!entry) {
    globalStore[key] = {
      externals: { data: null, isLoading: false },
      internals: { triggerChange, fetched: false },
    };
  } else {
    // in case the entry already has been initialized we guarantee
    // that the trigger change callback is not a noop
    globalStore[key].internals.triggerChange = triggerChange;
  }
}

export function setEntryExternals(
  key: string,
  newExternals: Partial<StoreEntry['externals']>,
) {
  const externals = globalStore[key].externals;

  globalStore[key].externals = { ...externals, ...newExternals };
}

export function getEntryExternals<TData>(key: string) {
  const externals = globalStore[key]
    .externals as StoreEntry<TData>['externals'];

  return externals;
}

// Internals data might be fetched for entries that have not yet been
// initialized so the return data might be undefined
export function getEntryInternals(
  key: string,
): StoreEntry['internals'] | undefined {
  return globalStore[key].internals;
}

export function setEntryFetched(key: string, value: boolean) {
  if (!globalStore[key]) {
    return;
  }

  globalStore[key].internals.fetched = value;
}
