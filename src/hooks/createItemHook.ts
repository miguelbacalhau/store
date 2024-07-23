import { useEffect, useMemo, useSyncExternalStore } from 'react';

import { createItem, CreateItemArgs } from '../core/createItem';
import { buildItemKey } from '../factories/keys';
import { getEntryInternals, setEntryFetched } from '../globals/globalStore';

type UseItemArgs<TData, TId, TArgs> = {
  resolver: (args: TArgs) => Promise<TData>;
} & Omit<CreateItemArgs<TData, TId, TArgs>, 'args'>;

export function createItemHook<TData, TId, TArgs>({
  key,
  getId,
  resolver,
}: UseItemArgs<TData, TId, TArgs>) {
  function useItem(args: TArgs) {
    const { subscribe, getSnapshot, setState } = useMemo(
      () => createItem({ key, getId, args }),
      [args],
    );

    const item = useSyncExternalStore(subscribe, getSnapshot);

    useEffect(() => {
      async function init() {
        const id = getId(args);
        const itemKey = buildItemKey(key, id);
        const itemInternals = getEntryInternals(itemKey);

        if (itemInternals && !itemInternals.fetched && !item?.data) {
          setState({ isLoading: true });

          const data = await resolver(args);

          setState({ isLoading: false, data });
          setEntryFetched(itemKey, true);
        }
      }

      init();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return item;
  }

  return useItem;
}
