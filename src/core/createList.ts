import { buildItemKey, buildListKey } from '../factories/keys';
import { Listeners } from '../factories/listeners';
import { createReference, Reference } from '../factories/reference';
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

  // the list only stores the ids of the items so to trigger a change it's necessary
  // to create a new data entry so that react will trigger a re-render
  function forceChange() {
    const listExternals = getEntryExternals<Reference[]>(listKey);
    const references = listExternals?.data;

    setEntryExternals(listKey, {
      ...listExternals,
      data: references ? [...references] : [],
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

      const listReference = createReference(listKey);

      itemInternals?.referencedBy.add(listReference);

      return createReference(itemKey);
    });

    setEntryExternals(listKey, {
      ...state,
      ...(dataIds ? { data: dataIds } : {}),
    });

    triggerChange();
  }

  function getSnapshot() {
    return getEntryExternals<Reference[]>(listKey);
  }

  if (!hasEntry(listKey)) {
    initEntry(listKey);
  }

  const itemInternals = getEntryInternals(listKey);

  if (itemInternals) {
    itemInternals.forceChange = forceChange;
  }

  return { subscribe, getSnapshot, setState };
}
