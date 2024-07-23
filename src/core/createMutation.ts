import { buildItemKey, buildListKey } from '../factories/keys';
import {
  getEntryExternals,
  getEntryInternals,
  initEntry,
  setEntryExternals,
} from '../globals/globalStore';

type CreateMutationArgs<TData, TId, TArgs> =
  | CreateOperationArgs<TData, TId, TArgs>
  | UpdateOperationArgs<TData, TId, TArgs>
  | DeleteUpdateArgs<TData, TId, TArgs>;

type CreateOperationArgs<TData, TId, TArgs> = {
  key: string;
  getId: (data: TData) => TId;
  operation: 'create';
  resolver: (args: TArgs) => Promise<TData>;
};

type UpdateOperationArgs<TData, TId, TArgs> = {
  key: string;
  getId: (data: TArgs) => TId;
  operation: 'update';
  resolver: (args: TArgs) => Promise<TData>;
};

type DeleteUpdateArgs<TData, TId, TArgs> = {
  key: string;
  getId: (data: TArgs) => TId;
  operation: 'delete';
  resolver: (args: TArgs) => Promise<TData>;
};

export function createMutation<TData, TId, TArgs>({
  key,
  getId,
  operation,
  resolver,
}: CreateMutationArgs<TData, TId, TArgs>) {
  async function mutation(args: TArgs) {
    if (operation === 'create') {
      return createOperation(key, getId, () => resolver(args));
    }

    if (operation === 'update') {
      return updateOperation(key, getId, args, resolver);
    }

    if (operation === 'delete') {
      return deleteOperation(key, getId, args, resolver);
    }
  }

  return mutation;
}

async function createOperation<TData, TId>(
  key: string,
  getId: (data: TData) => TId,
  resolver: () => Promise<TData>,
) {
  const listKey = buildListKey(key);
  const listInternals = getEntryInternals(listKey);

  const data = await resolver();

  const itemId = getId(data);
  const itemKey = buildItemKey(key, itemId);

  initEntry(itemKey, () => {});
  setEntryExternals(itemKey, { isLoading: false, data });

  const listExternals = getEntryExternals<TId[]>(listKey);

  if (listInternals) {
    const ids = listExternals?.data;

    if (ids) {
      setEntryExternals(listKey, { data: ids ? [...ids, itemId] : [itemId] });
      listInternals?.forceChange();
    }
  }
}

async function updateOperation<TData, TId, TArgs>(
  key: string,
  getId: (data: TArgs) => TId,
  args: TArgs,
  resolver: (args: TArgs) => Promise<TData>,
) {
  const itemId = getId(args);
  const itemKey = buildItemKey(key, itemId);

  const data = await resolver(args);

  setEntryExternals(itemKey, { isLoading: false, data });
}

async function deleteOperation<TData, TId, TArgs>(
  key: string,
  getId: (data: TArgs) => TId,
  args: TArgs,
  resolver: (args: TArgs) => Promise<TData>,
) {
  const itemId = getId(args);
  const itemKey = buildItemKey(key, itemId);

  const listKey = buildListKey(key);
  const listInternals = getEntryInternals(listKey);

  await resolver(args);

  setEntryExternals(itemKey, { isLoading: false, data: null });

  const listExternals = getEntryExternals<TId[]>(listKey);

  if (listInternals) {
    const ids = listExternals?.data?.filter((id) => id !== itemId);

    if (ids) {
      setEntryExternals(listKey, { data: ids });
      listInternals?.forceChange();
    }
  }
}
