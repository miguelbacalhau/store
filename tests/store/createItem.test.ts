import { describe, expect, jest, test } from '@jest/globals';

import { createItem } from '../../src/store/createItem';
import { initialEntryExternalFixture } from '../fixtures/globalStoreFixtures';

const key = 'Post';
const args = { id: 1 };

const { getSnapshot, setState, subscribe } = createItem({
  key,
  args,
  getId: (data) => data.id,
});

const listener1 = jest.fn();
const listener2 = jest.fn();

describe('createItem', () => {
  test('item data is initially empty', () => {
    const snapshot = getSnapshot();

    expect(snapshot).toEqual(initialEntryExternalFixture);
  });

  test('setState will change by merging the item data', () => {
    const data1 = { data: 1 };

    setState(data1);

    const snapshot1 = getSnapshot();

    expect(snapshot1).toEqual({ ...initialEntryExternalFixture, ...data1 });

    const data2 = { isLoading: true };

    setState(data2);

    const snapshot2 = getSnapshot();

    expect(snapshot2).toEqual({ ...data1, ...data2 });
  });

  test('subscribe will trigger the listener callback on setState', () => {
    const data = { data: 1 };

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
