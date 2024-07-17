import { useEffect, useSyncExternalStore } from 'react';

import { createList, CreateListArgs } from './createList';
import {
  getEntryExternals,
  getEntryInternals,
  setEntryFetched,
} from './globalStore';
import { getItemKey } from './keys';

type UseListArgs<TData, TId, TArgs> = {
  resolver: (args: TArgs) => Promise<TData[]>;
} & CreateListArgs<TData, TId>;

export function createListHook<TData, TId, TArgs>({
  key,
  getId,
  resolver,
}: UseListArgs<TData, TId, TArgs>) {
  const listStore = createList({ key, getId });

  function useList(args: TArgs) {
    const list = useSyncExternalStore(
      listStore.subscribe,
      listStore.getSnapshot,
    );

    const itemsData = list.data?.map((id) => {
      const itemKey = getItemKey(key, id);
      const itemExternal = getEntryExternals<TData>(itemKey);

      return itemExternal.data;
    });

    const listWithData = { ...list, data: itemsData || null };

    useEffect(() => {
      async function init() {
        const listInternals = getEntryInternals(key);

        if (listInternals && !listInternals.fetched && !list.data) {
          listStore.setState({ isLoading: true });

          const data = await resolver(args);

          listStore.setState({ isLoading: false, data });
          setEntryFetched(key, true);
        }
      }

      init();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return listWithData;
  }

  return useList;
}
