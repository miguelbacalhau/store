import { useMemo, useSyncExternalStore } from 'react';

import { createStore } from './createStore';

export function useStoreEntry(key: string) {
  const store = useMemo(() => createStore(key), [key]);

  return useSyncExternalStore(store.subscribe, store.getSnapshot);
}
