import { buildItemKey } from '../factories/keys';
import { Listeners } from '../factories/listeners';
import { defaultEntryExternals, Store, StoreEntry } from '../factories/store';

export type CreateListConfig<TData, TId> = {
  key: string;
  getId: (data: TData) => TId;
};

export function createList<TData, TId>(
  { getEntryExternals, initEntry, setEntryExternals }: Store,
  { addListener, removeListener, triggerListeners }: Listeners,
  { key, getId }: CreateListConfig<TData, TId>,
) {
  function triggerChange() {
    triggerListeners(key);
  }

  function forceChange() {
    const listExternals = getEntryExternals<TId[]>(key);
    const ids = listExternals?.data;

    setEntryExternals(key, {
      ...listExternals,
      data: ids ? [...ids] : [],
    });

    triggerChange();
  }

  function subscribe(listener: () => void) {
    addListener(key, listener);

    return () => {
      removeListener(key, listener);
    };
  }

  function setState(state: Partial<StoreEntry<TData[]>['externals']>) {
    const dataIds = state?.data?.map((item) => {
      const id = getId(item);
      const itemKey = buildItemKey(key, id);

      initEntry(itemKey, () => {});
      setEntryExternals(itemKey, { data: item });

      return id;
    });

    setEntryExternals(key, {
      ...state,
      ...(dataIds ? { data: dataIds } : {}),
    });

    triggerChange();
  }

  function getSnapshot() {
    return getEntryExternals<TId[]>(key);
  }

  initEntry(key, forceChange);

  return { subscribe, getSnapshot, setState };
}
