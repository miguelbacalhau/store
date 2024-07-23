import '@testing-library/jest-dom';

import { describe, expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react';
import React from 'react';

import { createItem } from '../../src/core/createItem';
import { createListeners } from '../../src/factories/listeners';
import { createStore } from '../../src/factories/store';
import { createItemHook } from '../../src/hooks/createItemHook';
import { StoreProvider } from '../../src/hooks/StoreProvider';
import { initialEntryExternalFixture } from '../fixtures/globalStoreFixtures';

const renderTracker = jest.fn();
const key = 'Fish';

const useFish = createItemHook({
  key,
  getId: (data) => data.id,
  resolver: (args: { id: number }) =>
    Promise.resolve({ id: args.id, name: 'John' }),
});

function createComponent() {
  const store = createStore();
  const listeners = createListeners();

  function BaseComponent() {
    renderTracker();

    useFish({ id: 1 });

    return <div>This is a component</div>;
  }

  function Component() {
    return (
      <StoreProvider store={store} listeners={listeners}>
        <BaseComponent />
      </StoreProvider>
    );
  }

  return { Component, store, listeners };
}

describe('createItemHook', () => {
  test('the created hook should only trigger a render initially', async () => {
    const { Component } = createComponent();

    render(<Component />);

    expect(renderTracker).toHaveBeenCalledTimes(1);
  });

  test('the created should trigger another render when the store changes', async () => {
    const { Component, store, listeners } = createComponent();

    const { setState } = createItem(store, listeners, {
      key,
      getId: (data) => data.id,
      args: { id: 1 },
    });

    render(<Component />);

    expect(renderTracker).toHaveBeenCalledTimes(1);

    setState({ ...initialEntryExternalFixture, data: { id: 1, name: 'Jane' } });

    expect(renderTracker).toHaveBeenCalledTimes(2);
  });
});
