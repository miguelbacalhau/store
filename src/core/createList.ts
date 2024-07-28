import { buildItemKey, buildListKey } from '../factories/keys';
import { Listeners } from '../factories/listeners';
import { Store, StoreEntry } from '../factories/store';

export type CreateListConfig<TData, TId, TArgs> = {
  key: string;
  getId: (data: TData) => TId;
  args?: TArgs;
};

export function createList<TData, TId, TArgs>(
  {
    initEntry,
    hasEntry,
    getEntryExternals,
    setEntryExternals,
    getEntryInternals,
  }: Store,
  { addListener, removeListener, triggerListeners }: Listeners,
  { key, getId, args }: CreateListConfig<TData, TId, TArgs>,
) {
  const listKey = buildListKey(key, args);

  function triggerChange() {
    triggerListeners(listKey);
  }

  function forceChange() {
    const listExternals = getEntryExternals<TId[]>(listKey);
    const ids = listExternals?.data;

    setEntryExternals(listKey, {
      ...listExternals,
      data: ids ? [...ids] : [],
    });

    triggerChange();
  }

  function subscribe(listener: () => void) {
    addListener(listKey, listener);

    return () => {
      removeListener(listKey, listener);
    };
  }

  function setState(state: Partial<StoreEntry<TData[]>['externals']>) {
    const dataIds = state?.data?.map((item) => {
      const id = getId(item);
      const itemKey = buildItemKey(key, id);

      if (!hasEntry(itemKey)) {
        initEntry(itemKey);
      }

      setEntryExternals(itemKey, { data: item });

      const itemInternals = getEntryInternals(itemKey);

      itemInternals?.inList.push(listKey);

      return id;
    });

    setEntryExternals(listKey, {
      ...state,
      ...(dataIds ? { data: dataIds } : {}),
    });

    triggerChange();
  }

  function getSnapshot() {
    return getEntryExternals<TId[]>(listKey);
  }

  if (!hasEntry(listKey)) {
    const listInternals = initEntry(listKey);
    listInternals.forceChange = forceChange;
  }

  return { subscribe, getSnapshot, setState };
}
