import { buildNewItemsKey } from '../factories/keys';
import { Listeners } from '../factories/listeners';
import { Reference } from '../factories/reference';
import { Store } from '../factories/store';

export type CreateNewItemsConfig = {
  key: string;
};

export function createNewItems(
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

  function triggerChange(changedKeys: string[]) {
    triggerListeners(newItemsKey, changedKeys);
  }

  function forceChange() {
    const listExternals = getEntryExternals<Reference[]>(newItemsKey);
    const refs = listExternals?.data;

    setEntryExternals(newItemsKey, {
      ...listExternals,
      data: refs ? [...refs] : [],
    });

    triggerChange(['data']);
  }

  function subscribe(listener: () => void) {
    addListener(newItemsKey, listener);

    return () => {
      removeListener(newItemsKey, listener);
    };
  }

  function getSnapshot() {
    return getEntryExternals<Reference[]>(newItemsKey);
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
