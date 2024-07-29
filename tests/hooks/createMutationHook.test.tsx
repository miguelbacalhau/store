import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';

import { describe, expect, test } from '@jest/globals';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { createListeners } from '../../src/factories/listeners';
import { createStore } from '../../src/factories/store';
import { createItemHook } from '../../src/hooks/createItemHook';
import { createListHook } from '../../src/hooks/createListHook';
import { createMutationHook } from '../../src/hooks/createMutationHook';
import { createNewItemsHook } from '../../src/hooks/createNewItemsHook';
import { StoreProvider } from '../../src/hooks/StoreProvider';

const key = 'Fish';

const initialName = 'Bass';
const updateName = 'Bream';

const useFish = createItemHook({
  key,
  getId: (data) => data.id,
  resolver: (args: { id: number }) =>
    Promise.resolve({ id: args.id, name: initialName }),
});

const useFishes = createListHook({
  key,
  getId: (data) => data.id,
  resolver: () =>
    Promise.resolve([
      { id: 1, name: initialName },
      { id: 2, name: 'Jelly' },
    ]),
});
const useNewFishes = createNewItemsHook<{ id: number; name: string }>({
  key,
});

const useFishCreate = createMutationHook({
  key,
  operation: 'create',
  getId: (data) => data.id,
  resolver: (args: { id: number; name: string }) =>
    Promise.resolve({ id: args.id, name: args.name }),
});

const useFishUpdate = createMutationHook({
  key,
  operation: 'update',
  getId: (data) => data.id,
  resolver: (args: { id: number; name: string }) =>
    Promise.resolve({ id: args.id, name: args.name }),
});

const useFishDelete = createMutationHook({
  key,
  operation: 'update',
  getId: (data) => data.id,
  resolver: (args: { id: number }) => Promise.resolve({ id: args.id }),
});

function createComponent() {
  const store = createStore();
  const listeners = createListeners();

  function List() {
    const { data: fishes } = useFishes(null);

    return (
      <>
        {fishes?.map((fish) => (
          <h1 data-testid="list" key={fish?.id}>
            {fish?.name}
          </h1>
        ))}
      </>
    );
  }
  function NewItems() {
    const { data: fishes } = useNewFishes();

    return (
      <>
        {fishes?.map((fish) => (
          <h1 data-testid="new-item" key={fish?.id}>
            {fish?.name}
          </h1>
        ))}
      </>
    );
  }

  function Item() {
    const { data: fish } = useFish({ id: 1 });

    return (
      <>
        <h1 data-testid="item">{fish?.name}</h1>
      </>
    );
  }

  function Buttons() {
    const { mutation: create } = useFishCreate();
    const { mutation: update } = useFishUpdate();
    const { mutation: remove } = useFishDelete();
    return (
      <>
        <button
          data-testid="create"
          onClick={() => create({ id: 3, name: updateName })}
        />
        <button
          data-testid="update"
          onClick={() => update({ id: 1, name: updateName })}
        />
        <button data-testid="delete" onClick={() => remove({ id: 1 })} />
      </>
    );
  }

  function Component() {
    return (
      <StoreProvider store={store} listeners={listeners}>
        <Item />
        <List />
        <NewItems />
        <Buttons />
      </StoreProvider>
    );
  }

  return Component;
}

describe('createMutationHook', () => {
  test('the created create hook should add the item to the list', async () => {
    const Component = createComponent();

    await act(async () => {
      render(<Component />);
    });

    screen.queryAllByTestId('new-item').forEach((item) => {
      expect(item).not.toHaveTextContent(updateName);
    });

    await userEvent.click(screen.getByTestId('create'));

    expect(screen.getByTestId('new-item')).toHaveTextContent(updateName);
  });

  test('the created update hook should mutate the item state', async () => {
    const Component = createComponent();

    await act(async () => {
      render(<Component />);
    });

    expect(screen.queryByTestId('item')).toHaveTextContent(initialName);

    await userEvent.click(screen.getByTestId('update'));

    expect(screen.queryByTestId('item')).toHaveTextContent(updateName);

    const list = screen.queryAllByTestId('list');

    list.forEach((item, index) => {
      if (index === 0) {
        expect(item).toHaveTextContent(updateName);
      }
    });
  });

  test('the created delete hook should mutate the item data and remove it from the list', async () => {
    const Component = createComponent();

    await act(async () => {
      render(<Component />);
    });

    await userEvent.click(screen.getByTestId('delete'));

    expect(screen.queryByTestId('item')).not.toHaveTextContent(initialName);

    const list = screen.queryAllByTestId('item');

    expect(list.length).toBe(1);
    list.forEach((heading, index) => {
      if (index === 1) {
        expect(heading).not.toHaveTextContent(initialName);
      }
    });
  });
});
