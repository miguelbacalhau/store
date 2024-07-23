import { describe, expect, test } from '@jest/globals';

import { buildItemKey, buildListKey } from '../../src/factories/keys';

describe('store keys getter', () => {
  test('item keys', () => {
    const itemKey = buildItemKey('Person', 1);

    expect(itemKey).toBe('Person 1');
  });

  test('list keys', () => {
    const listKey = buildListKey('Person');

    expect(listKey).toBe('Person');
  });
});
