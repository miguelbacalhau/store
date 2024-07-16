import { useEffect, useMemo, useSyncExternalStore } from 'react';

import { createList,CreateListArgs } from './createList';

type UseListArgs<TData, TId> = {
  resolver: () => Promise<TData[]>;
} & CreateListArgs<TData, TId>;

export function useList<TData, TId>({
  key,
  getId,
  resolver,
}: UseListArgs<TData, TId>) {
  const listStore = useMemo(() => createList({ key, getId }), [key]);
  const list = useSyncExternalStore(listStore.subscribe, listStore.getSnapshot);

  useEffect(() => {
    async function init() {
      if (!list) {
        listStore.setState({ isLoading: true });

        const data = await resolver();

        listStore.setState({ isLoading: false, data });
      }
    }

    init();
  }, []);

  return list;
}
