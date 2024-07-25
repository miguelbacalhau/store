import { buildItemKey, buildListKey } from '../factories/keys';
import { Listeners } from '../factories/listeners';
import { defaultEntryExternals, Store, StoreEntry } from '../factories/store';

export type CreateItemConfig<TData, TId, TArgs> = {
  key: string;
  getId: (args: TArgs, data?: TData) => TId;
  args: TArgs;
};

export function createItem<TData, TId, TArgs>(
  { getEntryExternals, getEntryInternals, initEntry, setEntryExternals }: Store,
  { addListener, removeListener, triggerListeners }: Listeners,
  { key, getId, args }: CreateItemConfig<TData, TId, TArgs>,
) {
  const id = getId(args);
  const itemKey = buildItemKey(key, id);
  const listKey = buildListKey(key);

  function subscribe(listener: () => void) {
    addListener(itemKey, listener);

    return () => {
      removeListener(itemKey, listener);
    };
  }

  function triggerChange() {
    triggerListeners(itemKey);
  }

  function setState(state: Partial<StoreEntry['externals']>) {
    setEntryExternals(itemKey, state);

    const listInternals = getEntryInternals(listKey);
    const listExternals = getEntryExternals<TId[]>(listKey);

    if (listExternals) {
      const isItemInList = listExternals.data?.includes(id);

      if (listInternals && isItemInList) {
        listInternals.forceChange();
      }
    }

    triggerChange();
  }

  function getSnapshot() {
    const externals = getEntryExternals<TData>(itemKey);

    if (externals) {
      return externals;
    }

    return defaultEntryExternals;
  }

  initEntry(itemKey, triggerChange);

  return { subscribe, getSnapshot, setState };
}
