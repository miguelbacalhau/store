import { useEffect, useMemo, useSyncExternalStore } from 'react';

import { createList, CreateListConfig } from '../core/createList';
import { buildItemKey } from '../factories/keys';
import { StoreEntry } from '../factories/store';
import { useStore } from './useStore';

type UseCreateListConfig<TData, TId, TArgs> = {
  resolver: (args: TArgs) => Promise<TData[]>;
} & Omit<CreateListConfig<TData, TId, TArgs>, 'args'>;

type UseListHook<TData, TArgs> = TArgs extends undefined
  ? () => StoreEntry<TData[]>['externals']
  : (args: TArgs) => StoreEntry<TData[]>['externals'];

export function createListHook<TData, TId, TArgs>({
  key,
  getId,
  resolver,
}: UseCreateListConfig<TData, TId, TArgs>): UseListHook<TData, TArgs> {
  function useList(args: TArgs): StoreEntry<TData>['externals'] {
    const { store, listeners } = useStore();
    const { subscribe, getSnapshot, setState } = useMemo(
      () =>
        createList(store, listeners, {
          key,
          getId,
          args,
        }),
      [listeners, store, args],
    );

    const list = useSyncExternalStore(subscribe, getSnapshot);

    const itemsData = list.data?.map((id) => {
      const itemKey = buildItemKey(key, id);
      const itemExternal = store.getEntryExternals<TData>(itemKey);

      return itemExternal.data;
    });

    const listWithData = { ...list, data: itemsData || null };

    useEffect(() => {
      async function init() {
        if (!list.isFetched && !list.data) {
          setState({ isLoading: true });

          const data = await resolver(args);

          setState({ isLoading: false, isFetched: true, data });
        }
      }

      init();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return listWithData as StoreEntry<TData>['externals'];
  }

  return useList;
}
