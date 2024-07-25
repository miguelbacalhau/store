export type StoreEntry<TData = unknown> = {
  externals: {
    isLoading: boolean;
    isFetched: boolean;
    data: null | TData;
  };
  internals: {
    forceChange: () => void;
  };
};

export const defaultEntryExternals: StoreEntry<null>['externals'] = {
  isLoading: false,
  isFetched: false,
  data: null,
};

export function createStore() {
  const store: Record<string, StoreEntry> = {};

  function initEntry(key: string, forceChange: () => void) {
    const entry = store[key];

    if (!entry) {
      store[key] = {
        externals: { data: null, isLoading: false, isFetched: false },
        internals: { forceChange },
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

  return {
    store,
    initEntry,
    getEntryExternals,
    setEntryExternals,
    getEntryInternals,
  };
}

export type Store = ReturnType<typeof createStore>;
