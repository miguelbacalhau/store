import { useEffect, useMemo, useSyncExternalStore } from 'react';

import { createList, CreateListConfig } from '../core/createList';
import { buildItemKey } from '../factories/keys';
import { useStore } from './useStore';

type UseListArgs<TData, TId, TArgs> = {
  resolver: (args: TArgs) => Promise<TData[]>;
} & CreateListConfig<TData, TId>;

export function createListHook<TData, TId, TArgs>({
  key,
  getId,
  resolver,
}: UseListArgs<TData, TId, TArgs>) {
  function useList(args: TArgs) {
    const { store, listeners } = useStore();
    const { subscribe, getSnapshot, setState } = useMemo(
      () =>
        createList(store, listeners, {
          key,
          getId,
        }),
      [listeners, store],
    );

    const list = useSyncExternalStore(subscribe, getSnapshot);

    const itemsData = list?.data?.map((id) => {
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

    return listWithData;
  }

  return useList;
}
