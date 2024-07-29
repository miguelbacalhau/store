import { buildNewItemsKey } from '../factories/keys';
import { Listeners } from '../factories/listeners';
import { Store } from '../factories/store';

export type CreateNewItemsConfig = {
  key: string;
};

export function createNewItems<TId>(
  {
    initEntry,
    hasEntry,
    getEntryExternals,
    setEntryExternals,
    getEntryInternals,
  }: Store,
  { addListener, removeListener, triggerListeners }: Listeners,
  { key }: CreateNewItemsConfig,
) {
  const newItemsKey = buildNewItemsKey(key);

  function triggerChange() {
    triggerListeners(newItemsKey);
  }

  function forceChange() {
    const listExternals = getEntryExternals<TId[]>(newItemsKey);
    const ids = listExternals?.data;

    setEntryExternals(newItemsKey, {
      ...listExternals,
      data: ids ? [...ids] : [],
    });

    triggerChange();
  }

  function subscribe(listener: () => void) {
    addListener(newItemsKey, listener);

    return () => {
      removeListener(newItemsKey, listener);
    };
  }

  function getSnapshot() {
    return getEntryExternals<TId[]>(newItemsKey);
  }

  if (!hasEntry(newItemsKey)) {
    initEntry(newItemsKey);
  }

  const itemInternals = getEntryInternals(newItemsKey);

  if (itemInternals) {
    itemInternals.forceChange = forceChange;
  }

  return { subscribe, getSnapshot };
}
