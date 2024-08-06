import { buildItemKey, buildNewItemsKey } from '../factories/keys';
import { Store } from '../factories/store';
import { Reference } from '../factories/reference';

export type CreateMutationConfig<TData, TId, TArgs> =
  | CreateOperationConfig<TData, TId, TArgs>
  | UpdateOperationConfig<TData, TId, TArgs>
  | DeleteUpdateConfig<TData, TId, TArgs>;

type CreateOperationConfig<TData, TId, TArgs> = {
  key: string;
  getId: (data: TData) => TId;
  operation: 'create';
  resolver: (args: TArgs) => Promise<TData>;
};

type UpdateOperationConfig<TData, TId, TArgs> = {
  key: string;
  getId: (data: TArgs) => TId;
  operation: 'update';
  resolver: (args: TArgs) => Promise<TData>;
};

type DeleteUpdateConfig<TData, TId, TArgs> = {
  key: string;
  getId: (data: TArgs) => TId;
  operation: 'delete';
  resolver: (args: TArgs) => Promise<TData>;
};

export function createMutation<TData, TId, TArgs>(
  store: Store,
  { key, getId, operation, resolver }: CreateMutationConfig<TData, TId, TArgs>,
) {
  async function mutation(args: TArgs) {
    if (operation === 'create') {
      return createOperation(store, key, getId, () => resolver(args));
    }

    if (operation === 'update') {
      return updateOperation(store, key, getId, args, resolver);
    }

    if (operation === 'delete') {
      return deleteOperation(store, key, getId, args, resolver);
    }
  }

  return mutation;
}

async function createOperation<TData, TId>(
  {
    initEntry,
    hasEntry,
    getEntryExternals,
    setEntryExternals,
    getEntryInternals,
  }: Store,
  key: string,
  getId: (data: TData) => TId,
  resolver: () => Promise<TData>,
) {
  const data = await resolver();

  const itemId = getId(data);
  const itemKey = buildItemKey(key, itemId);

  if (!hasEntry(itemKey)) {
    initEntry(itemKey);
  }

  const itemInternals = getEntryInternals(itemKey);

  setEntryExternals(itemKey, { isLoading: false, data });
  itemInternals?.forceChange();

  const newItemsKey = buildNewItemsKey(key);

  if (!hasEntry(newItemsKey)) {
    initEntry(newItemsKey);
  }

  const newItemsExternals = getEntryExternals<TId[]>(newItemsKey);
  const newItemsInternals = getEntryInternals(newItemsKey);

  const ids = newItemsExternals.data ? newItemsExternals.data : [];

  setEntryExternals(newItemsKey, {
    data: [...ids, itemId],
  });
  newItemsInternals?.forceChange();
}

async function updateOperation<TData, TId, TArgs>(
  { setEntryExternals, getEntryInternals }: Store,
  key: string,
  getId: (data: TArgs) => TId,
  args: TArgs,
  resolver: (args: TArgs) => Promise<TData>,
) {
  const itemId = getId(args);
  const itemKey = buildItemKey(key, itemId);
  const itemInternals = getEntryInternals(itemKey);

  setEntryExternals(itemKey, { isLoading: true });

  itemInternals?.forceChange();

  const data = await resolver(args);

  setEntryExternals(itemKey, { isLoading: false, data });

  itemInternals?.forceChange();

  itemInternals?.referencedBy.forEach((reference) => {
    const listInternals = getEntryInternals(reference.referenceKey);

    listInternals?.forceChange();
  });
}

async function deleteOperation<TData, TId, TArgs>(
  { getEntryExternals, getEntryInternals, setEntryExternals }: Store,
  key: string,
  getId: (data: TArgs) => TId,
  args: TArgs,
  resolver: (args: TArgs) => Promise<TData>,
) {
  const itemId = getId(args);
  const itemKey = buildItemKey(key, itemId);
  const itemInternals = getEntryInternals(itemKey);

  setEntryExternals(itemKey, { isLoading: true });
  itemInternals?.forceChange();

  await resolver(args);

  setEntryExternals(itemKey, { isLoading: false, data: null });
  itemInternals?.forceChange();

  itemInternals?.referencedBy.forEach((reference) => {
    const listKey = reference.referenceKey;

    const listInternals = getEntryInternals(listKey);
    const listExternals = getEntryExternals<Reference[]>(listKey);

    const ids = listExternals.data?.filter((reference) => {
      return reference.referenceKey !== itemKey;
    });

    if (ids) {
      setEntryExternals(listKey, { data: ids });
      listInternals?.forceChange();
    }
  });
}
