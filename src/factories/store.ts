import { Reference } from './reference';

export type StoreEntry<TData = unknown> = {
  externals: {
    isLoading: boolean;
    isFetched: boolean;
    data: null | TData;
    error: null | unknown;
  };
  internals: {
    forceChange: () => void;
    referencedBy: Set<Reference>;
  };
};

export const defaultEntryExternals: StoreEntry<null>['externals'] = {
  isLoading: false,
  isFetched: false,
  data: null,
  error: null,
};

export function createStore() {
  const store: Record<string, StoreEntry> = {};

  function initEntry<TData>(key: string) {
    const entry: StoreEntry<TData> = {
      externals: {
        data: null,
        error: null,
        isLoading: false,
        isFetched: false,
      },
      internals: { forceChange: () => {}, referencedBy: new Set() },
    };

    store[key] = entry;
  }

  function hasEntry(key: string) {
    return Boolean(store[key]);
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
    const externals = store[key] ? store[key].externals : defaultEntryExternals;

    return externals as StoreEntry<TData>['externals'];
  }

  // Internals data might be fetched for entries that have not yet been
  // initialized so the return data might be undefined
  function getEntryInternals(key: string): StoreEntry['internals'] | undefined {
    return store[key] && store[key].internals;
  }

  return {
    store,
    initEntry,
    hasEntry,
    getEntryExternals,
    setEntryExternals,
    getEntryInternals,
  };
}

export type Store = ReturnType<typeof createStore>;
