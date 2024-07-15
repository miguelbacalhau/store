import { globalStore } from './globalStore';
import { getItemKey } from './keys';

type CreateListArgs<TData, TId> = {
  key: string;
  getId: (data: TData) => TId;
  resolver: () => TData[];
};

export function createList<TData, TId>({
  key,
  getId,
  resolver,
}: CreateListArgs<TData, TId>) {
  let listeners: (() => void)[] = [];

  // list cache to prevent getSnapshot from causing
  // infinite re-renders
  let list: TData[] = [];

  const data = resolver();

  const dataIds = data.map((entry) => {
    const id = getId(entry);
    const itemKey = getItemKey(key, id);

    globalStore[itemKey] = { data: entry };

    return id;
  });

  globalStore[key] = { data: dataIds, triggerChange };

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

  function setState(newState: TData) {
    globalStore[key].data = newState;

    triggerChange();
  }

  function getSnapshot() {
    const dataIds = globalStore[key].data as TId[];

    // reset array
    list.length = 0;

    dataIds.forEach((id) => {
      const itemKey = getItemKey(key, id);

      list.push(globalStore[itemKey].data as TData);
    });

    return list;
  }

  return { subscribe, getSnapshot, setState };
}
