import { buildItemKey } from '../factories/keys';
import { Listeners } from '../factories/listeners';
import { Store, StoreEntry } from '../factories/store';
import { createTracker } from '../factories/tracker';

export type CreateItemConfig<TData, TId, TArgs> = {
  key: string;
  getId: (args: TArgs, data?: TData) => TId;
  args: TArgs;
  selector?: undefined;
};

export function createItem<TData, TId, TArgs>(
  {
    initEntry,
    hasEntry,
    getEntryExternals,
    getEntryInternals,
    setEntryExternals,
  }: Store,
  { addListener, removeListener, triggerListeners }: Listeners,
  config: CreateItemConfig<TData, TId, TArgs>,
) {
  const { key, args, getId } = config;

  const id = getId(args);
  const itemKey = buildItemKey(key, id);

  const tracker = createTracker();

  function subscribe(listener: () => void) {
    function narrowedListener(changedKeys: string[]) {
      const isTracked = tracker.isTracking(changedKeys);

      if (isTracked) {
        tracker.reset();

        listener();
      }
    }

    addListener(itemKey, narrowedListener);

    return () => {
      removeListener(itemKey, narrowedListener);
    };
  }

  function triggerChange(trackedKeys: string[]) {
    triggerListeners(itemKey, trackedKeys);
  }

  function setState(state: Partial<StoreEntry['externals']>) {
    setEntryExternals(itemKey, state);

    const itemInternals = getEntryInternals(itemKey);

    itemInternals?.referencedBy.forEach((reference) => {
      const listKey = reference.referenceKey;

      const listInternals = getEntryInternals(listKey);

      if (listInternals) {
        // item changes trigger changes to the list data property
        listInternals.forceChange(['data']);
      }
    });

    triggerChange(Object.keys(state));
  }

  function getSnapshot() {
    const externals = getEntryExternals<TData>(itemKey);

    return tracker.track(externals);
  }

  if (!hasEntry(itemKey)) {
    initEntry(itemKey);
  }

  const itemInternals = getEntryInternals(itemKey);

  if (itemInternals) {
    itemInternals.forceChange = triggerChange;
  }

  return { subscribe, getSnapshot, setState };
}
