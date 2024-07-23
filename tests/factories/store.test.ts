import { describe, expect, test } from '@jest/globals';

import { createStore } from '../../src/factories/store';
import {
  forceChangeFixture,
  initialEntryFixture,
} from '../fixtures/globalStoreFixtures';

const key = 'Person';

describe('global store basic functions', () => {
  test('is empty initially', () => {
    const { store } = createStore();

    expect(store).toEqual({});
  });

  test('initialization includes all necessary fields', () => {
    const { store, initEntry } = createStore();

    initEntry(key, forceChangeFixture);

    expect(store[key]).toEqual(initialEntryFixture);
  });

  test('initializing a second time only changes the force change callback', () => {
    const { store, initEntry } = createStore();

    const newForceChange = () => {};

    initEntry(key, forceChangeFixture);
    initEntry(key, newForceChange);

    expect(store[key]).toEqual({
      ...initialEntryFixture,
      internals: {
        ...initialEntryFixture.internals,
        forceChange: newForceChange,
      },
    });
  });

  test('getExternal should return only the external story entry data', () => {
    const { initEntry, getEntryExternals } = createStore();

    initEntry(key, forceChangeFixture);

    const externals = getEntryExternals(key);

    expect(externals).toEqual(initialEntryFixture.externals);
  });

  test('setExternal should change the external story entry data', () => {
    const { store, initEntry, setEntryExternals } = createStore();

    initEntry(key, forceChangeFixture);

    const newExternals = { data: 1, isLoading: true };

    setEntryExternals(key, newExternals);

    expect(store[key]).toEqual({
      externals: newExternals,
      internals: initialEntryFixture.internals,
    });
  });

  test('setExternal should change the external story entry data', () => {
    const { store, initEntry, setEntryExternals } = createStore();

    initEntry(key, forceChangeFixture);

    const newExternals = { data: 1, isLoading: true };

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

    initEntry(key, forceChangeFixture);

    const afterInitInternals = getEntryInternals(key);

    expect(afterInitInternals).toEqual(initialEntryFixture.internals);
  });
});
