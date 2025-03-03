import { ReactNode } from 'react';

import { createItem } from '../core/createItem';
import { createList } from '../core/createList';
import { createListeners } from '../factories/listeners';
import { createStore, StoreEntry } from '../factories/store';
import { StoreProvider } from './StoreProvider';

export function createClient() {
  const store = createStore();
  const listeners = createListeners();

  function updateItem(
    key: string,
    id: unknown,
    data: Partial<StoreEntry['externals']['data']>,
  ) {
    const item = createItem(store, listeners, {
      key,
      getId: () => id,
      args: {},
    });

    item.setState({ data });
  }

  function updateList<TData, TId, TArgs>(
    key: string,
    args: TArgs,
    getId: (data: TData) => TId,
    data: StoreEntry<TData[]>['externals']['data'],
  ) {
    const list = createList<TData, TId, TArgs>(store, listeners, {
      key,
      getId,
      args,
    });

    list.setState({ data });
  }

  const client = { updateItem, updateList };

  function Provider({ children }: { children: ReactNode }) {
    return (
      <StoreProvider store={store} listeners={listeners}>
        {children}
      </StoreProvider>
    );
  }

  return { client, Provider };
}
