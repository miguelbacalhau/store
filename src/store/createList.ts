import {
  getEntryExternals,
  initEntry,
  setEntryExternals,
  StoreEntry,
} from './globalStore';
import { getItemKey } from './keys';
import { addListener, removeListener, triggerListener } from './listener';

export type CreateListArgs<TData, TId> = {
  key: string;
  getId: (data: TData) => TId;
};

export function createList<TData, TId>({
  key,
  getId,
}: CreateListArgs<TData, TId>) {
  function triggerChange() {
    triggerListener(key);
  }

  function forceChange() {
    const listExternals = getEntryExternals<TId[]>(key);
    const ids = listExternals.data;

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
      const itemKey = getItemKey(key, id);

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
