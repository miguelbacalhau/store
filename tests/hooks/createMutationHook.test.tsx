import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';

import { describe, expect, jest, test } from '@jest/globals';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { createListeners } from '../../src/factories/listeners';
import { createStore } from '../../src/factories/store';
import { createItemHook } from '../../src/hooks/createItemHook';
import { createMutationHook } from '../../src/hooks/createMutationHook';
import { StoreProvider } from '../../src/hooks/StoreProvider';

const renderTracker = jest.fn();
const key = 'Fish';

const initialName = 'Bass';
const updateName = 'Bream';

const useFish = createItemHook({
  key,
  getId: (data) => data.id,
  resolver: (args: { id: number }) =>
    Promise.resolve({ id: args.id, name: initialName }),
});

const useFishUpdate = createMutationHook({
  key,
  operation: 'update',
  getId: (data) => data.id,
  resolver: (args: { id: number; name: string }) =>
    Promise.resolve({ id: args.id, name: args.name }),
});

function createComponent() {
  const store = createStore();
  const listeners = createListeners();

  function BaseComponent() {
    renderTracker();

    const { data: fish } = useFish({ id: 1 });
    const { mutation } = useFishUpdate();

    return (
      <>
        <h1>{fish?.name}</h1>
        <button onClick={() => mutation({ id: 1, name: updateName })} />
      </>
    );
  }

  function Component() {
    return (
      <StoreProvider store={store} listeners={listeners}>
        <BaseComponent />
      </StoreProvider>
    );
  }

  return { Component };
}

describe('createItemHook', () => {
  test('the created hook should mutate the state', async () => {
    const { Component } = createComponent();

    await act(async () => {
      render(<Component />);
    });

    expect(await screen.findByRole('heading')).toHaveTextContent(initialName);

    await userEvent.click(screen.getByRole('button'));

    expect(await screen.findByRole('heading')).toHaveTextContent(updateName);
  });
});
