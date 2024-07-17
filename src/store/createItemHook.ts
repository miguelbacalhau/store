import { useEffect, useMemo, useSyncExternalStore } from 'react';

import { createItem, CreateItemArgs } from './createItem';
import { getEntryInternals, setEntryFetched } from './globalStore';
import { getItemKey } from './keys';

type UseItemArgs<TData, TId, TArgs> = {
  resolver: (args: TArgs) => Promise<TData>;
} & Omit<CreateItemArgs<TData, TId, TArgs>, 'args'>;

export function createItemHook<TData, TId, TArgs>({
  key,
  getId,
  resolver,
}: UseItemArgs<TData, TId, TArgs>) {
  function useItem(args: TArgs) {
    const itemStore = useMemo(() => createItem({ key, getId, args }), [args]);

    const item = useSyncExternalStore(
      itemStore.subscribe,
      itemStore.getSnapshot,
    );

    useEffect(() => {
      async function init() {
        const id = getId(args);
        const itemKey = getItemKey(key, id);
        const itemInternals = getEntryInternals(itemKey);

        if (itemInternals && !itemInternals.fetched && !item.data) {
          itemStore.setState({ isLoading: true });

          const data = await resolver(args);

          itemStore.setState({ isLoading: false, data });
          setEntryFetched(itemKey, true);
        }
      }

      init();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function mutate(data: Partial<TData>) {
      itemStore.setState({ ...item, data: { ...item.data, ...data } });
    }

    return { ...item, mutate };
  }

  return useItem;
}
