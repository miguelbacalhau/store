import { createItemHook } from '../../src/hooks/createItemHook';
import { createListHook } from '../../src/hooks/createListHook';
import { createMutationHook } from '../../src/hooks/createMutationHook';
import { createNewItemsHook } from '../../src/hooks/createNewItemsHook';

export type Comment = { id: number; content: string };

const key = 'Comment';

let nextId = 0;

function postGenerator(amount: number) {
  return Array.from({ length: amount }, () => {
    nextId++;

    return {
      id: nextId,
      content: `This is a very nice comment ${nextId}`,
    };
  });
}

export const useComment = createItemHook({
  key,
  getId: (data) => data.id,
  resolver: async (args: Pick<Comment, 'id'>) => {
    return Promise.resolve({ id: args.id, name: 'Mike' });
  },
});

export const useCommentList = createListHook({
  key,
  getId: (data) => data.id,
  resolver: () => {
    return Promise.resolve(postGenerator(100));
  },
});

export const useNewComments = createNewItemsHook<Comment>({ key });

export const useCreateComment = createMutationHook({
  key,
  getId: (data) => data.id,
  operation: 'create',
  resolver: async ({ content }: Comment) => {
    nextId++;
    return Promise.resolve({ id: nextId, content });
  },
});

export const useUpdateComment = createMutationHook({
  key,
  getId: (data) => data.id,
  operation: 'update',
  resolver: async ({ id, content }: Comment) => {
    return Promise.resolve({ id, content });
  },
});

export const useDeleteComment = createMutationHook({
  key,
  getId: (data) => data.id,
  operation: 'delete',
  resolver: async ({ id }: Pick<Comment, 'id'>) => {
    return Promise.resolve({ id });
  },
});
