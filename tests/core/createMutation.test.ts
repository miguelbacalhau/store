import { describe, expect, test } from '@jest/globals';

import { createItem } from '../../src/core/createItem';
import { createList } from '../../src/core/createList';
import { createMutation } from '../../src/core/createMutation';
import { initialEntryExternalFixture } from '../fixtures/globalStoreFixtures';

const key = 'Book';

const list = createList({
  key,
  getId: (data: { id: number; title: string }) => data.id,
});

const item = createItem({
  key,
  args: { id: 1 },
  getId: (data) => data.id,
});

const book1 = { id: 1, title: 'Math 101' };
const book2 = { id: 2, title: 'Poetry' };
const book3 = { id: 3, title: 'How to fall a sleep' };

const bookList = [book1, book2, book3];

list.setState({ data: bookList });
item.setState({ data: book1 });

describe('createMutation', () => {
  test('list data is initially empty', async () => {
    const book4 = { id: 4, title: 'Maps of Europe' };

    const mutation = createMutation({
      key,
      getId: (data) => data.id,
      operation: 'create',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      resolver: (_: null) => Promise.resolve(book4),
    });

    const snapshotBeforeMutation = list.getSnapshot();

    const bookIds = bookList.map((book) => book.id);

    expect(snapshotBeforeMutation).toEqual({
      ...initialEntryExternalFixture,
      data: bookIds,
    });

    await mutation(null);

    const snapshotAfterMutation = list.getSnapshot();

    expect(snapshotAfterMutation).toEqual({
      ...initialEntryExternalFixture,
      data: [...bookIds, book4.id],
    });

    const item4 = createItem({
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
});
