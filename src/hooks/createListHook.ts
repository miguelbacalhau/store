import { useEffect, useSyncExternalStore } from 'react';

import { createList, CreateListArgs } from '../core/createList';
import { buildItemKey } from '../factories/keys';
import {
  getEntryExternals,
  getEntryInternals,
  setEntryFetched,
} from '../globals/globalStore';

type UseListArgs<TData, TId, TArgs> = {
  resolver: (args: TArgs) => Promise<TData[]>;
} & CreateListArgs<TData, TId>;

export function createListHook<TData, TId, TArgs>({
  key,
  getId,
  resolver,
}: UseListArgs<TData, TId, TArgs>) {
  const { subscribe, getSnapshot, setState } = createList({ key, getId });

  function useList(args: TArgs) {
    const list = useSyncExternalStore(subscribe, getSnapshot);

    const itemsData = list?.data?.map((id) => {
      const itemKey = buildItemKey(key, id);
      const itemExternal = getEntryExternals<TData>(itemKey);

      return itemExternal?.data;
    });

    const listWithData = { ...list, data: itemsData || null };

    useEffect(() => {
      async function init() {
        const listInternals = getEntryInternals(key);

        if (listInternals && !listInternals.fetched && !list?.data) {
          setState({ isLoading: true });

          const data = await resolver(args);

          setState({ isLoading: false, data });
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
