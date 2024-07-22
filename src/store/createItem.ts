import {
  getEntryExternals,
  getEntryInternals,
  initEntry,
  setEntryExternals,
  StoreEntry,
} from './globalStore';
import { getItemKey, getListKey } from './keys';
import { addListener, removeListener, triggerListener } from './listener';

export type CreateItemArgs<TData, TId, TArgs> = {
  key: string;
  getId: (args: TArgs, data?: TData) => TId;
  args: TArgs;
};

export function createItem<TData, TId, TArgs>({
  key,
  getId,
  args,
}: CreateItemArgs<TData, TId, TArgs>) {
  const id = getId(args);
  const itemKey = getItemKey(key, id);
  const listKey = getListKey(key);

  function subscribe(listener: () => void) {
    addListener(itemKey, listener);

    return () => {
      removeListener(itemKey, listener);
    };
  }

  function triggerChange() {
    triggerListener(itemKey);
  }

  function setState(state: Partial<StoreEntry['externals']>) {
    setEntryExternals(itemKey, state);

    const listInternals = getEntryInternals(listKey);
    const listExternals = getEntryExternals<TId[]>(listKey);

    const isItemInList = listExternals.data?.includes(id);

    if (listInternals && isItemInList) {
      listInternals.forceChange();
    }

    triggerChange();
  }

  function getSnapshot() {
    return getEntryExternals<TData>(itemKey);
  }

  initEntry(itemKey, triggerChange);

  return { subscribe, getSnapshot, setState };
}
