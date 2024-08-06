import { describe, expect, test } from '@jest/globals';

import { createItem } from '../../src/core/createItem';
import { createList } from '../../src/core/createList';
import { createMutation } from '../../src/core/createMutation';
import { createReference } from '../../src/factories/reference';
import { buildItemKey } from '../../src/factories/keys';
import { createListeners } from '../../src/factories/listeners';
import { createStore } from '../../src/factories/store';
import { initialEntryExternalFixture } from '../fixtures/storeFixtures';

const key = 'Book';

const book1 = { id: 1, title: 'Math 101' };
const book2 = { id: 2, title: 'Poetry' };
const book3 = { id: 3, title: 'How to fall a sleep' };

const bookList = [book1, book2, book3];

function init() {
  const store = createStore();
  const listeners = createListeners();

  const list = createList(store, listeners, {
    key,
    getId: (data: { id: number; title: string }) => data.id,
  });

  const item = createItem(store, listeners, {
    key,
    args: { id: 1 },
    getId: (data) => data.id,
  });

  list.setState({ data: bookList });
  item.setState({ data: book1 });

  return { store, listeners, list, item };
}

describe('createMutation', () => {
  test('create operation mutation add a new item to the list', async () => {
    const { store, listeners } = init();

    const book4 = { id: 4, title: 'Maps of Europe' };

    const mutation = createMutation(store, {
      key,
      getId: (data) => data.id,
      operation: 'create',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      resolver: (_: null) => Promise.resolve(book4),
    });

    await mutation(null);

    const item4 = createItem(store, listeners, {
      key,
      args: { id: 4 },
      getId: (data) => data.id,
    });

    const item4Snapshot = item4.getSnapshot();

    expect(item4Snapshot).toEqual({
      ...initialEntryExternalFixture,
      data: book4,
    });
  });

  test('update operation mutation changes the item data and updates the list', async () => {
    const { store, list, item } = init();

    const updatedBook = { id: 1, title: 'History of Zimbabwe' };

    const mutation = createMutation(store, {
      key,
      getId: (data) => data.id,
      operation: 'update',
      resolver: (data: { id: number; title: string }) => Promise.resolve(data),
    });

    const snapshotBeforeMutation = list.getSnapshot();

    const itemReferences = bookList.map((e) => {
      const itemKey = buildItemKey(key, e.id);

      return createReference(itemKey);
    });

    expect(snapshotBeforeMutation).toEqual({
      ...initialEntryExternalFixture,
      data: itemReferences,
    });

    const itemBeforeSnapshot = item.getSnapshot();

    expect(itemBeforeSnapshot).toEqual({
      ...initialEntryExternalFixture,
      data: book1,
    });

    await mutation(updatedBook);

    const snapshotAfterMutation = list.getSnapshot();

    expect(snapshotAfterMutation).toEqual({
      ...initialEntryExternalFixture,
      data: itemReferences,
    });

    const itemAfterSnapshot = item.getSnapshot();

    expect(itemAfterSnapshot).toEqual({
      ...initialEntryExternalFixture,
      data: updatedBook,
    });
  });

  test('delete operation mutation removes item data and removed the item from the list', async () => {
    const { store, list, item } = init();

    const mutation = createMutation(store, {
      key,
      getId: (data) => data.id,
      operation: 'delete',
      resolver: (data: { id: number }) => Promise.resolve(data),
    });

    const snapshotBeforeMutation = list.getSnapshot();

    const itemReferences = bookList.map((e) => {
      const itemKey = buildItemKey(key, e.id);

      return createReference(itemKey);
    });

    expect(snapshotBeforeMutation).toEqual({
      ...initialEntryExternalFixture,
      data: itemReferences,
    });

    const itemBeforeSnapshot = item.getSnapshot();

    expect(itemBeforeSnapshot).toEqual({
      ...initialEntryExternalFixture,
      data: book1,
    });

    await mutation({ id: 1 });

    const snapshotAfterMutation = list.getSnapshot();

    expect(snapshotAfterMutation).toEqual({
      ...initialEntryExternalFixture,
      data: itemReferences.filter((reference) => {
        const itemKey = buildItemKey(key, 1);

        return reference.referenceKey !== itemKey;
      }),
    });

    const itemAfterSnapshot = item.getSnapshot();

    expect(itemAfterSnapshot).toEqual({
      ...initialEntryExternalFixture,
      data: null,
    });
  });
});
