import { useSyncExternalStore } from 'react';

import { useStore } from '../react/useStore';
import { createDevStore } from './createDevStore';

export function useDevStore() {
  const { store, listeners } = useStore();
  const { subscribe, getSnapshot } = createDevStore(store, listeners);

  return useSyncExternalStore(subscribe, getSnapshot);
}
