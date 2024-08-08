import '@testing-library/jest-dom';

import { describe, expect, jest, test } from '@jest/globals';
import { act, render, renderHook } from '@testing-library/react';
import React, { ReactNode } from 'react';

import { createItem } from '../../src/core/createItem';
import { createListeners } from '../../src/factories/listeners';
import { createStore } from '../../src/factories/store';
import { createItemHook } from '../../src/hooks/createItemHook';
import { StoreProvider } from '../../src/hooks/StoreProvider';
import { initialEntryExternalFixture } from '../fixtures/storeFixtures';

const renderTracker = jest.fn();
const key = 'Fish';

// the component will render once initially and twice more,
// once to set the isLoading state and another to set the data state
const BASE_RENDERS = 3;

const useFish = createItemHook({
  key,
  getId: (data) => data.id,
  resolver: (args: { id: number }) =>
    Promise.resolve({ id: args.id, name: 'John' }),
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

  return { Provider, store, listeners };
}
function createComponent() {
  const { Provider, store, listeners } = createProvider();

  function BaseComponent() {
    renderTracker();

    useFish({ id: 1 });

    return <div>This is a component</div>;
  }

  function Component() {
    return (
      <Provider>
        <BaseComponent />
      </Provider>
    );
  }

  return { Component, store, listeners };
}

describe('createItemHook', () => {
  test('the created hook should only trigger a render initially', async () => {
    const { Component } = createComponent();

    await act(async () => {
      render(<Component />);
    });

    expect(renderTracker).toHaveBeenCalledTimes(BASE_RENDERS);
  });

  test('the created hook should trigger another render when the store changes', async () => {
    const { Component, store, listeners } = createComponent();

    const { setState } = createItem(store, listeners, {
      key,
      getId: (data) => data.id,
      args: { id: 1 },
    });

    await act(async () => {
      render(<Component />);
    });

    expect(renderTracker).toHaveBeenCalledTimes(BASE_RENDERS);

    await act(async () => {
      setState({
        ...initialEntryExternalFixture,
        data: { id: 1, name: 'Sardine' },
      });
    });

    expect(renderTracker).toHaveBeenCalledTimes(BASE_RENDERS + 1);
  });

  test('the created hook should not trigger re-renders if there is already data in the store', async () => {
    const { Component, store, listeners } = createComponent();

    const { setState } = createItem(store, listeners, {
      key,
      getId: (data) => data.id,
      args: { id: 1 },
    });

    setState({
      ...initialEntryExternalFixture,
      isFetched: true,
      data: { id: 1, name: 'Sardine' },
    });

    expect(renderTracker).not.toHaveBeenCalled();

    await act(async () => {
      render(<Component />);
    });

    expect(renderTracker).toHaveBeenCalledTimes(1);
  });

  test('the created hook should not trigger extra re-renders if the selected data does not change', async () => {
    const { Provider, store, listeners } = createProvider();

    function Component() {
      renderTracker();

      const fish = useFish({ id: 1 }, (state) => state.data);

      return (
        <Provider>
          <div>{fish?.name}</div>
        </Provider>
      );
    }

    expect(renderTracker).not.toHaveBeenCalled();

    await act(async () => {
      render(<Component />);
    });

    expect(renderTracker).toHaveBeenCalledTimes(BASE_RENDERS - 1);

    const { setState } = createItem(store, listeners, {
      key,
      getId: (data) => data.id,
      args: { id: 1 },
    });

    setState({
      isLoading: true,
    });

    expect(renderTracker).toHaveBeenCalledTimes(BASE_RENDERS - 1);
  });

  test('when the item resolver promise is rejects the hook should return the value rejection', async () => {
    const { Provider } = createProvider();

    const error = new Error('cannot load fish');

    const useError = createItemHook({
      key,
      getId: (data) => data.id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      resolver: (_: { id: number }) => Promise.reject(error),
    });

    const hookResult = await act(async () => {
      const { result } = renderHook(() => useError({ id: 1 }), {
        wrapper: Provider,
      });

      return result;
    });

    expect(hookResult.current.error).toEqual(error);
  });

  test('the item resolver throws an exception the hook should return the value thrown', async () => {
    const { Provider } = createProvider();

    const error = new Error('cannot load fish');

    const useError = createItemHook({
      key,
      getId: (data) => data.id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      resolver: async (_: { id: number }) => {
        throw error;
      },
    });

    const hookResult = await act(async () => {
      const { result } = renderHook(() => useError({ id: 1 }), {
        wrapper: Provider,
      });

      return result;
    });

    expect(hookResult.current.error).toEqual(error);
  });
});
