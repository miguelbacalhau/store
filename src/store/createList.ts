import { globalStore, initEntry,StoreEntry } from './globalStore';
import { getItemKey } from './keys';

export type CreateListArgs<TData, TId> = {
  key: string;
  getId: (data: TData) => TId;
};

export function createList<TData, TId>({
  key,
  getId,
}: CreateListArgs<TData, TId>) {
  let listeners: (() => void)[] = [];

  // list cache to prevent getSnapshot from causing
  // infinite re-renders
  let list: TData[] = [];

  globalStore[key] = initEntry(triggerChange);

  function triggerChange() {
    // create a new reference for the list cache so the
    // update can be triggered
    list = [];
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  function setState(state: Partial<StoreEntry['externals']>) {
    const externals = globalStore[key].externals;

    const dataIds = (state?.data as TData[] | null)?.map((item) => {
      const id = getId(item);
      const itemKey = getItemKey(key, id);

      globalStore[itemKey] = initEntry(() => {});
      globalStore[itemKey].externals.data = item;

      return id;
    });

    globalStore[key].externals = {
      ...externals,
      ...state,
      ...(dataIds ? { data: dataIds } : {}),
    };

    triggerChange();
  }

  function getSnapshot() {
    const dataIds = globalStore[key].externals.data as TId[] | null;

    if (!dataIds) {
      return null;
    }

    // reset array
    list.length = 0;

    dataIds.forEach((id) => {
      const itemKey = getItemKey(key, id);

      list.push(globalStore[itemKey].externals.data as TData);
    });

    return list;
  }

  return { subscribe, getSnapshot, setState };
}
