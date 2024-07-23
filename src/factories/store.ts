export type StoreEntry<TData = unknown> = {
  externals: {
    isLoading: boolean;
    data: null | TData;
  };
  internals: {
    fetched: boolean;
    forceChange: () => void;
  };
};

export function createStore() {
  const store: Record<string, StoreEntry> = {};

  function initEntry(key: string, forceChange: () => void) {
    const entry = store[key];

    if (!entry) {
      store[key] = {
        externals: { data: null, isLoading: false },
        internals: { forceChange, fetched: false },
      };
    } else {
      // in case the entry already has been initialized we guarantee
      // that the force change callback is not a noop
      store[key].internals.forceChange = forceChange;
    }
  }

  function setEntryExternals(
    key: string,
    newExternals: Partial<StoreEntry['externals']>,
  ) {
    if (!store[key]) {
      return;
    }

    const externals = store[key].externals;

    store[key].externals = { ...externals, ...newExternals };
  }

  function getEntryExternals<TData>(key: string) {
    const externals = store[key] && store[key].externals;

    return externals as StoreEntry<TData>['externals'] | undefined;
  }

  // Internals data might be fetched for entries that have not yet been
  // initialized so the return data might be undefined
  function getEntryInternals(key: string): StoreEntry['internals'] | undefined {
    return store[key] && store[key].internals;
  }

  function setEntryFetched(key: string, value: boolean) {
    if (!store[key]) {
      return;
    }

    store[key].internals.fetched = value;
  }

  return {
    store,
    initEntry,
    getEntryExternals,
    setEntryExternals,
    getEntryInternals,
    setEntryFetched,
  };
}
