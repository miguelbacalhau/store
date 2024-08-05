import { buildItemKey } from '../factories/keys';
import { Listeners } from '../factories/listeners';
import { Store, StoreEntry } from '../factories/store';

export type Selector<TData, TSelect> = (
  data: StoreEntry<TData>['externals'],
) => TSelect;

type CreateItemConfigBase<TData, TId, TArgs> = {
  key: string;
  getId: (args: TArgs, data?: TData) => TId;
  args: TArgs;
  selector?: undefined;
};

type CreateItemConfigSelector<TData, TId, TArgs, TSelect> = {
  key: string;
  getId: (args: TArgs, data?: TData) => TId;
  args: TArgs;
  selector: (data: StoreEntry<TData>['externals']) => TSelect;
};

export type CreateItemConfig<TData, TId, TArgs, TSelect> =
  | CreateItemConfigBase<TData, TId, TArgs>
  | CreateItemConfigSelector<TData, TId, TArgs, TSelect>;

export function createItem<TData, TId, TArgs, TSelect>(
  {
    initEntry,
    hasEntry,
    getEntryExternals,
    getEntryInternals,
    setEntryExternals,
  }: Store,
  { addListener, removeListener, triggerListeners }: Listeners,
  config: CreateItemConfig<TData, TId, TArgs, TSelect>,
) {
  const { key, args, getId } = config;

  const id = getId(args);
  const itemKey = buildItemKey(key, id);

  function subscribe(listener: () => void) {
    addListener(itemKey, listener);

    return () => {
      removeListener(itemKey, listener);
    };
  }

  function triggerChange() {
    triggerListeners(itemKey);
  }

  function setState(state: Partial<StoreEntry['externals']>) {
    setEntryExternals(itemKey, state);

    const itemInternals = getEntryInternals(itemKey);

    itemInternals?.referencedBy.forEach((reference) => {
      const listKey = reference.referenceKey;

      const listInternals = getEntryInternals(listKey);
      const listExternals = getEntryExternals<TId[]>(listKey);

      if (listExternals) {
        const isItemInList = listExternals.data?.includes(id);

        if (listInternals && isItemInList) {
          listInternals.forceChange();
        }
      }
    });

    triggerChange();
  }

  function getSnapshot() {
    const externals = getEntryExternals<TData>(itemKey);

    return config.selector ? config.selector(externals) : externals;
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
