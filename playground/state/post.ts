import { createItemHook } from '../../src/hooks/createItemHook';
import { createListHook } from '../../src/hooks/createListHook';
import { createMutationHook } from '../../src/hooks/createMutationHook';
import { createNewItemsHook } from '../../src/hooks/createNewItemsHook';
import { timeout } from '../utils/timeout';

export type Post = { id: number; title: string; description: string };

const key = 'Post';

let nextId = 0;

function postGenerator(amount: number) {
  return Array.from({ length: amount }, () => {
    nextId++;

    return {
      id: nextId,
      title: `Post title ${nextId}`,
      description: `this i a post about ${nextId} things`,
    };
  });
}

export const usePost = createItemHook({
  key,
  getId: (data) => data.id,
  resolver: async (args: Pick<Post, 'id'>) => {
    await timeout(2000);
    return Promise.resolve({ id: args.id, name: 'Mike' });
  },
});

export const usePostList = createListHook({
  key,
  getId: (data) => data.id,
  resolver: () => {
    return Promise.resolve(postGenerator(10));
  },
});

export const useNewPosts = createNewItemsHook<Post>({ key });

export const useCreatePost = createMutationHook({
  key,
  getId: (data) => data.id,
  operation: 'create',
  resolver: async ({ title, description }: Post) => {
    nextId++;
    return Promise.resolve({ id: nextId, title, description });
  },
});

export const useUpdatePost = createMutationHook({
  key,
  getId: (data) => data.id,
  operation: 'update',
  resolver: async ({ id, title, description }: Post) => {
    return Promise.resolve({ id, title, description });
  },
});

export const useDeletePost = createMutationHook({
  key,
  getId: (data) => data.id,
  operation: 'delete',
  resolver: async ({ id }: Pick<Post, 'id'>) => {
    return Promise.resolve({ id });
  },
});
