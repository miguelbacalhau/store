import { buildItemKey, buildNewItemsKey } from '../factories/keys';
import { createReference, Reference } from '../factories/reference';
import { Store } from '../factories/store';

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

  const itemState = { isLoading: false, data };

  const loadingTrxId = Date.now();

  setEntryExternals(loadingTrxId, itemKey, itemState);
  itemInternals?.forceChange(loadingTrxId, Object.keys(itemState));

  const newItemsKey = buildNewItemsKey(key);

  if (!hasEntry(newItemsKey)) {
    initEntry(newItemsKey);
  }

  const newItemsExternals = getEntryExternals<TId[]>(newItemsKey);
  const newItemsInternals = getEntryInternals(newItemsKey);

  const refs = newItemsExternals.data ? newItemsExternals.data : [];

  const newItemState = {
    data: [...refs, createReference(itemKey)],
  };

  const createTrxId = Date.now();

  setEntryExternals(createTrxId, newItemsKey, newItemState);
  newItemsInternals?.forceChange(createTrxId, Object.keys(newItemState));
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

  const loadingState = { isLoading: true };
  const loadingTrxId = Date.now();

  setEntryExternals(loadingTrxId, itemKey, loadingState);
  itemInternals?.forceChange(loadingTrxId, Object.keys(loadingState));

  const data = await resolver(args);

  const resolvedState = { isLoading: false, data };
  const updateTrxId = Date.now();

  setEntryExternals(updateTrxId, itemKey, resolvedState);
  itemInternals?.forceChange(updateTrxId, Object.keys(resolvedState));

  itemInternals?.referencedBy.forEach((reference) => {
    const listInternals = getEntryInternals(reference.referenceKey);

    // when an item changes then the list data should also change
    listInternals?.forceChange(updateTrxId, ['data']);
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

  const loadingState = { isLoading: true };
  const loadingTrxId = Date.now();

  setEntryExternals(loadingTrxId, itemKey, loadingState);
  itemInternals?.forceChange(loadingTrxId, Object.keys(loadingState));

  await resolver(args);

  const resolvedState = { isLoading: false, data: null };
  const deleteTrxId = Date.now();

  setEntryExternals(deleteTrxId, itemKey, resolvedState);
  itemInternals?.forceChange(deleteTrxId, Object.keys(resolvedState));

  itemInternals?.referencedBy.forEach((reference) => {
    const listKey = reference.referenceKey;

    const listInternals = getEntryInternals(listKey);
    const listExternals = getEntryExternals<Reference[]>(listKey);

    const refs = listExternals.data?.filter((reference) => {
      return reference.referenceKey !== itemKey;
    });

    if (refs) {
      const listState = { data: refs };

      setEntryExternals(deleteTrxId, listKey, listState);
      listInternals?.forceChange(deleteTrxId, Object.keys(listState));
    }
  });
}
