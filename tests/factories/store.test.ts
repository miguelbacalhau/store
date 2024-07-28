import { describe, expect, test } from '@jest/globals';

import { createStore } from '../../src/factories/store';
import {
  forceChange,
  initialEntryExternalFixture,
  initialEntryFixture,
} from '../fixtures/storeFixtures';

const key = 'Person';

describe('global store basic functions', () => {
  test('is empty initially', () => {
    const { store } = createStore();

    expect(store).toEqual({});
  });

  test('initialization includes all necessary fields', () => {
    const { store, initEntry } = createStore();

    const internals = initEntry(key);
    internals.forceChange = forceChange;

    expect(store[key]).toEqual(initialEntryFixture);
  });

  test('getExternal should return only the external story entry data', () => {
    const { initEntry, getEntryExternals } = createStore();

    initEntry(key);

    const internals = initEntry(key);
    internals.forceChange = forceChange;
    const externals = getEntryExternals(key);

    expect(externals).toEqual(initialEntryExternalFixture);
  });

  test('setExternal should change the external story entry data', () => {
    const { store, initEntry, setEntryExternals } = createStore();

    const internals = initEntry(key);
    internals.forceChange = forceChange;

    const newExternals = {
      ...initialEntryExternalFixture,
      data: 1,
      isLoading: true,
    };

    setEntryExternals(key, newExternals);

    expect(store[key]).toEqual({
      externals: newExternals,
      internals: initialEntryFixture.internals,
    });
  });

  test('getInternals should return only the internal story entry data', () => {
    const { initEntry, getEntryInternals } = createStore();

    const beforeInitInternals = getEntryInternals(key);

    expect(beforeInitInternals).toBe(undefined);

    const internals = initEntry(key);
    internals.forceChange = forceChange;

    const afterInitInternals = getEntryInternals(key);

    expect(afterInitInternals).toEqual(initialEntryFixture.internals);
  });
});
