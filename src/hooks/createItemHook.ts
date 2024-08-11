import { useEffect, useMemo, useSyncExternalStore } from 'react';

import { createItem, CreateItemConfig } from '../core/createItem';
import { buildItemKey } from '../factories/keys';
import { useStore } from './useStore';

type UseItemArgs<TData, TId, TArgs> = {
  resolver: (args: TArgs) => Promise<TData>;
} & Omit<CreateItemConfig<TData, TId, TArgs>, 'args' | 'selector'>;

export function createItemHook<TData, TId, TArgs>({
  key,
  getId,
  resolver,
}: UseItemArgs<TData, TId, TArgs>) {
  function useItem(args: TArgs) {
    const { store, listeners } = useStore();
    const { subscribe, getSnapshot, setState } = useMemo(
      () => createItem(store, listeners, { key, getId, args }),
      [args, store, listeners],
    );

    const item = useSyncExternalStore(subscribe, getSnapshot);

    const itemId = getId(args);
    const itemKey = buildItemKey(key, itemId);

    useEffect(() => {
      async function init() {
        const itemExternals = store.getEntryExternals(itemKey);

        if (
          !itemExternals.isFetched &&
          !itemExternals.isLoading &&
          !itemExternals.data
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

    return item;
  }

  return useItem;
}
