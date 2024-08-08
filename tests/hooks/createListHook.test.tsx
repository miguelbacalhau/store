import '@testing-library/jest-dom';

import { describe, expect, test } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';
import React, { ReactNode } from 'react';

import { createListeners } from '../../src/factories/listeners';
import { createStore } from '../../src/factories/store';
import { createListHook } from '../../src/hooks/createListHook';
import { StoreProvider } from '../../src/hooks/StoreProvider';

const key = 'Fish';

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

describe('createListHook', () => {
  test('when the item resolver promise is rejects the hook should return the value rejection', async () => {
    const { Provider } = createProvider();

    const error = new Error('cannot load fishes');

    const useError = createListHook({
      key,
      getId: () => 'unknown',
      resolver: () => Promise.reject(error),
    });

    const hookResult = await act(async () => {
      const { result } = renderHook(() => useError(null), {
        wrapper: Provider,
      });

      return result;
    });

    expect(hookResult.current.error).toEqual(error);
  });

  test('the item resolver throws an exception the hook should return the value thrown', async () => {
    const { Provider } = createProvider();

    const error = new Error('cannot load fishes');

    const useError = createListHook({
      key,
      getId: () => 'unknown',
      resolver: async () => {
        throw error;
      },
    });

    const hookResult = await act(async () => {
      const { result } = renderHook(() => useError(null), {
        wrapper: Provider,
      });

      return result;
    });

    expect(hookResult.current.error).toEqual(error);
  });
});
