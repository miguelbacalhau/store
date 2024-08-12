import { useMemo, useSyncExternalStore } from 'react';

import { createNewItems, CreateNewItemsConfig } from '../core/createNewItems';
import { useStore } from '../react/useStore';

type CreateNewItemsArg = CreateNewItemsConfig;

export function createNewItemsHook<TData>({ key }: CreateNewItemsArg) {
  function useNewItems() {
    const { store, listeners } = useStore();
    const { subscribe, getSnapshot } = useMemo(
      () =>
        createNewItems(store, listeners, {
          key,
        }),
      [listeners, store],
    );

    const list = useSyncExternalStore(subscribe, getSnapshot);

    const itemsData = list.data?.map((reference) => {
      const itemKey = reference.referenceKey;
      const itemExternal = store.getEntryExternals<TData>(itemKey);

      return itemExternal.data;
    });

    const listWithData = { ...list, data: itemsData || null };

    return listWithData;
  }

  return useNewItems;
}
