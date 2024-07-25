import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';

import { describe, expect, test } from '@jest/globals';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { ReactNode } from 'react';

import { createListeners } from '../../src/factories/listeners';
import { createStore } from '../../src/factories/store';
import { createItemHook } from '../../src/hooks/createItemHook';
import { createListHook } from '../../src/hooks/createListHook';
import { createMutationHook } from '../../src/hooks/createMutationHook';
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

function createProvider() {
  const store = createStore();
  const listeners = createListeners();

  function Provider({ children }: { children: ReactNode }) {
    return (
      <StoreProvider store={store} listeners={listeners}>
        {children}
      </StoreProvider>
    );
  }

  return Provider;
}

describe('createMutationHook', () => {
  test('the created create hook should add the item to the list', async () => {
    const Provider = createProvider();

    function BaseComponent() {
      const { data: fishes } = useFishes(null);
      const { mutation } = useFishCreate();

      return (
        <>
          {fishes?.map((fish) => <h1 key={fish?.id}>{fish?.name}</h1>)}
          <button onClick={() => mutation({ id: 3, name: updateName })} />
        </>
      );
    }

    await act(async () => {
      render(
        <Provider>
          <BaseComponent />
        </Provider>,
      );
    });

    screen.queryAllByRole('heading').forEach((heading) => {
      expect(heading).not.toHaveTextContent(updateName);
    });

    await userEvent.click(screen.getByRole('button'));

    const list = screen.queryAllByRole('heading');

    expect(list.length).toBe(3);

    list.forEach((heading, index) => {
      if (index === 2) {
        expect(heading).toHaveTextContent(updateName);
      } else {
        expect(heading).not.toHaveTextContent(updateName);
      }
    });
  });

  test('the created update hook should mutate the item state', async () => {
    const Provider = createProvider();

    function BaseComponent() {
      const { data: fish } = useFish({ id: 1 });
      const { mutation } = useFishUpdate();

      return (
        <>
          <h1>{fish?.name}</h1>
          <button onClick={() => mutation({ id: 1, name: updateName })} />
        </>
      );
    }

    await act(async () => {
      render(
        <Provider>
          <BaseComponent />
        </Provider>,
      );
    });

    expect(screen.queryByRole('heading')).toHaveTextContent(initialName);

    await userEvent.click(screen.getByRole('button'));

    expect(screen.queryByRole('heading')).toHaveTextContent(updateName);
  });

  test('the created delete hook should mutate the item data and remove it from the list', async () => {
    const Provider = createProvider();

    function BaseComponent() {
      const { data: fish } = useFish({ id: 1 });
      const { data: fishes } = useFishes(null);
      const { mutation } = useFishDelete();

      return (
        <>
          <h1 data-testid="item">{fish?.name}</h1>
          {fishes?.map((fish) => (
            <h1 data-testid="list" key={fish?.id}>
              {fish?.name}
            </h1>
          ))}
          <button onClick={() => mutation({ id: 1 })} />
        </>
      );
    }

    await act(async () => {
      render(
        <Provider>
          <BaseComponent />
        </Provider>,
      );
    });

    await userEvent.click(screen.getByRole('button'));

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
