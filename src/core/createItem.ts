import { buildItemKey, buildListKey } from '../factories/keys';
import { StoreEntry } from '../factories/store';
import {
  addListener,
  removeListener,
  triggerListeners,
} from '../globals/globalListeners';
import {
  getEntryExternals,
  getEntryInternals,
  initEntry,
  setEntryExternals,
} from '../globals/globalStore';

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
    return getEntryExternals<TData>(itemKey);
  }

  initEntry(itemKey, triggerChange);

  return { subscribe, getSnapshot, setState };
}
