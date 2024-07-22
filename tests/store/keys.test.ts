import { describe, expect, test } from '@jest/globals';

import { getItemKey, getListKey } from '../../src/store/keys';

describe('store keys getter', () => {
  test('item keys', () => {
    const itemKey = getItemKey('Person', 1);

    expect(itemKey).toBe('Person 1');
  });

  test('list keys', () => {
    const listKey = getListKey('Person');

    expect(listKey).toBe('Person');
  });
});
