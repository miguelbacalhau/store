import { useEffect, useMemo, useSyncExternalStore } from 'react';

import { createItem, CreateItemConfig, Selector } from '../core/createItem';
import { buildItemKey } from '../factories/keys';
import { StoreEntry } from '../factories/store';
import { useStore } from './useStore';

type UseItemArgs<TData, TId, TArgs> = {
  resolver: (args: TArgs) => Promise<TData>;
} & Omit<CreateItemConfig<TData, TId, TArgs, null>, 'args' | 'selector'>;

export function createItemHook<TData, TId, TArgs>({
  key,
  getId,
  resolver,
}: UseItemArgs<TData, TId, TArgs>) {
  function useItem(args: TArgs): StoreEntry<TData>['externals'];
  function useItem<TSelect>(
    args: TArgs,
    selector: Selector<TData, TSelect>,
  ): TSelect;
  function useItem<TSelect = TData>(
    args: TArgs,
    selector?: Selector<TData, TSelect>,
  ) {
    const { store, listeners } = useStore();
    const { subscribe, getSnapshot, setState } = useMemo(
      () => createItem(store, listeners, { key, getId, args, selector }),
      [args, selector, store, listeners],
    );

    const item = useSyncExternalStore(subscribe, getSnapshot);

    const itemId = getId(args);
    const itemKey = buildItemKey(key, itemId);

    useEffect(() => {
      async function init() {
        const itemExternals = store.getEntryExternals(itemKey);

        if (!itemExternals.isFetched && !itemExternals.data) {
          setState({ isLoading: true });

          const data = await resolver(args);

          setState({ isLoading: false, isFetched: true, data });
        }
      }

      init();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return item;
  }

  return useItem;
}
