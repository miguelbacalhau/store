import { useEffect, useMemo, useSyncExternalStore } from 'react';

import { createList, CreateListConfig } from '../core/createList';
import { buildListKey } from '../factories/keys';
import { useStore } from '../react/useStore';

type UseListArgs<TData, TId, TArgs> = {
  resolver: (args: TArgs) => Promise<TData[]>;
} & Omit<CreateListConfig<TData, TId, TArgs>, 'args'>;

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
          args,
        }),
      [listeners, store, args],
    );

    const list = useSyncExternalStore(subscribe, getSnapshot);
    const listKey = buildListKey(key, args);

    useEffect(() => {
      async function init() {
        // fetch the entry data directly from the store to make sure it's
        // up to date
        const listExternals = store.getEntryExternals(listKey);

        if (
          !listExternals.isFetched &&
          !listExternals.isLoading &&
          !listExternals.data
        ) {
          setState({ isLoading: true });

          try {
            const data = await resolver(args);

            setState({ isLoading: false, isFetched: true, data });
          } catch (error) {
            setState({ isLoading: false, error });
          }
        }
      }

      init();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const itemsData = list.data?.map((reference) => {
      const itemKey = reference.referenceKey;
      const itemExternal = store.getEntryExternals<TData>(itemKey);

      return itemExternal.data;
    });

    const listWithData = { ...list, data: itemsData || null };

    return listWithData;
  }

  return useList;
}
