import {
  getEntryExternals,
  initEntry,
  setEntryExternals,
  StoreEntry,
} from './globalStore';
import { getItemKey } from './keys';
import { createListener } from './listener';

export type CreateListArgs<TData, TId> = {
  key: string;
  getId: (data: TData) => TId;
};

const { addListener, removeListener, triggerListener } = createListener();

export function createList<TData, TId>({
  key,
  getId,
}: CreateListArgs<TData, TId>) {
  initEntry(key, triggerChange);

  function triggerChange() {
    triggerListener(key);
  }

  function subscribe(listener: () => void) {
    addListener(key, listener);

    return () => {
      removeListener(key, listener);
    };
  }

  function setState(state: Partial<StoreEntry['externals']>) {
    const dataIds = (state?.data as TData[] | null)?.map((item) => {
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
    return getEntryExternals<TData[]>(key);
  }

  return { subscribe, getSnapshot, setState };
}
