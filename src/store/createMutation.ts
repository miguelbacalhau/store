import {
  getEntryExternals,
  getEntryInternals,
  initEntry,
  setEntryExternals,
} from './globalStore';
import { getItemKey, getListKey } from './keys';

type CreateMutationArgs<TData, TId, TArgs> = {
  key: string;
  getId: (data: TArgs) => TId;
  operation: 'create' | 'update' | 'delete';
  resolver: (args: TArgs) => Promise<TData>;
};
export function createMutation<TData, TId, TArgs>({
  key,
  getId,
  operation,
  resolver,
}: CreateMutationArgs<TData, TId, TArgs>) {
  async function mutation(args: TArgs) {
    const itemId = getId(args);
    const itemKey = getItemKey(key, itemId);
    const listKey = getListKey(key);

    if (operation === 'create') {
      initEntry(itemKey, () => {});
    }

    const itemInternals = getEntryInternals(itemKey);
    const listInternals = getEntryInternals(listKey);

    setEntryExternals(itemKey, { isLoading: true });
    itemInternals?.forceChange();

    const data = await resolver(args);

    const listExternals = getEntryExternals<TId[]>(listKey);

    if (operation === 'create') {
      setEntryExternals(itemKey, { isLoading: false, data });
    }

    if (operation === 'create' && listInternals) {
      const ids = listExternals.data;

      if (ids) {
        setEntryExternals(listKey, { data: ids ? [...ids, itemId] : [itemId] });
        listInternals?.forceChange();
      }
    }

    if (operation === 'update') {
      setEntryExternals(itemKey, { isLoading: false, data });
    }

    if (operation === 'delete') {
      setEntryExternals(itemKey, { isLoading: false, data: null });
    }

    if (operation === 'delete' && listInternals) {
      const ids = listExternals.data?.filter((id) => id !== itemId);

      if (ids) {
        setEntryExternals(listKey, { data: ids });
        listInternals?.forceChange();
      }
    }

    itemInternals?.forceChange();
  }

  return mutation;
}
