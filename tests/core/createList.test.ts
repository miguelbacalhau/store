import { describe, expect, jest, test } from '@jest/globals';

import { createList } from '../../src/core/createList';
import { buildItemKey } from '../../src/factories/keys';
import { createListeners } from '../../src/factories/listeners';
import { createReference } from '../../src/factories/reference';
import { createStore } from '../../src/factories/store';
import { initialEntryExternalFixture } from '../fixtures/storeFixtures';

const key = 'Page';

const store = createStore();
const listeners = createListeners();

const { getSnapshot, setState, subscribe } = createList(store, listeners, {
  key,
  getId: (data: { id: number; title: string }) => data.id,
});

const listener1 = jest.fn();
const listener2 = jest.fn();

describe('createList', () => {
  test('list data is initially empty', () => {
    const snapshot = getSnapshot();

    expect(snapshot).toEqual(initialEntryExternalFixture);
  });

  test('setState will change by merging the list data', () => {
    const data1 = { data: [{ id: 1, title: 'News' }] };

    setState(data1);

    const snapshot1 = getSnapshot();

    const itemReferences = {
      data: data1.data.map((e) => {
        const itemKey = buildItemKey(key, e.id);

        return createReference(itemKey);
      }),
    };

    expect(snapshot1).toEqual({
      ...initialEntryExternalFixture,
      ...itemReferences,
    });

    const data2 = { isLoading: true };

    setState(data2);

    const snapshot2 = getSnapshot();

    expect(snapshot2).toEqual({
      ...initialEntryExternalFixture,
      ...itemReferences,
      ...data2,
    });
  });

  test('subscribe will trigger the listener callback on setState', () => {
    const data = { data: [{ id: 1, title: 'News' }] };

    setState(data);

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).not.toHaveBeenCalled();

    const unsubscribe = subscribe(listener1);

    setState(data);

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).not.toHaveBeenCalled();

    subscribe(listener2);

    setState(data);

    expect(listener1).toHaveBeenCalledTimes(2);
    expect(listener2).toHaveBeenCalledTimes(1);

    unsubscribe();

    setState(data);

    expect(listener1).toHaveBeenCalledTimes(2);
    expect(listener2).toHaveBeenCalledTimes(2);
  });
});
