import { useMemo, useSyncExternalStore } from 'react';

import { useStore } from '../../react/useStore';
import { createDevStore } from './createDevStore';

export function useDevStore() {
  const { store, listeners } = useStore();
  const { subscribe, getSnapshot } = useMemo(
    () => createDevStore(store, listeners),
    [store, listeners],
  );

  const devStore = useSyncExternalStore(subscribe, getSnapshot);

  return { devStore };
}
