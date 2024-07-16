import { useEffect, useSyncExternalStore } from 'react';

import { createList, CreateListArgs } from './createList';

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

    useEffect(() => {
      async function init() {
        if (!list) {
          listStore.setState({ isLoading: true });

          const data = await resolver(args);

          listStore.setState({ isLoading: false, data });
        }
      }

      init();
    }, []);

    return list;
  }

  return useList;
}
