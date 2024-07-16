import { globalStore, initEntry } from './globalStore';
import { getItemKey, getListKey } from './keys';

type CreateItemArgs<TData, TId> = {
  key: string;
  getId: (data: TData) => TId;
  resolver: () => TData;
};

export function createItem<TData, TId>({
  key,
  getId,
  resolver,
}: CreateItemArgs<TData, TId>) {
  let listeners: (() => void)[] = [];

  const data = resolver();
  const id = getId(data);
  const itemKey = getItemKey(key, id);
  const listKey = getListKey(key);

  function subscribe(listener: () => void) {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  function triggerChange() {
    listeners.forEach((listener) => listener());
  }

  function setState(newState: TData) {
    globalStore[itemKey].externals.data = newState;

    const list = globalStore[listKey];

    if (list) {
      list.internals.triggerChange();
    }

    triggerChange();
  }

  function getSnapshot() {
    return globalStore[itemKey].externals.data as TData;
  }

  globalStore[itemKey] = initEntry(triggerChange);
  globalStore[itemKey].externals.data = data;

  return { subscribe, getSnapshot, setState };
}
