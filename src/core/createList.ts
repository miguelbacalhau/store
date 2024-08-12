import { buildItemKey, buildListKey } from '../factories/keys';
import { Listeners } from '../factories/listeners';
import { createReference, Reference } from '../factories/reference';
import { Store, StoreEntry } from '../factories/store';
import { createTracker } from '../factories/tracker';

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

  const tracker = createTracker();

  function triggerChange(changedKeys: string[]) {
    triggerListeners(listKey, changedKeys);
  }

  // the list only stores the ids of the items so to trigger a change it's necessary
  // to create a new data entry so that react will trigger a re-render
  function forceChange(changedKeys: string[]) {
    const listExternals = getEntryExternals<Reference[]>(listKey);
    const references = listExternals?.data;

    setEntryExternals(listKey, {
      ...listExternals,
      data: references ? [...references] : [],
    });

    triggerChange(changedKeys);
  }

  function subscribe(listener: () => void) {
    function narrowedListener(changedKeys: string[]) {
      const isTracked = tracker.isTracking(changedKeys);

      if (isTracked) {
        tracker.reset();

        listener();
      }
    }

    addListener(listKey, narrowedListener);

    return () => {
      removeListener(listKey, narrowedListener);
    };
  }

  function setState(state: Partial<StoreEntry<TData[]>['externals']>) {
    const references = state?.data?.map((item) => {
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
      ...(references ? { data: references } : {}),
    });

    triggerChange(Object.keys(state));
  }

  function getSnapshot() {
    const externals = getEntryExternals<Reference[]>(listKey);

    return tracker.track(externals);
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
