import { createItemHook } from '../../src/hooks/createItemHook';
import { createListHook } from '../../src/hooks/createListHook';
import { createMutationHook } from '../../src/hooks/createMutationHook';
import { createNewItemsHook } from '../../src/hooks/createNewItemsHook';

export type Person = { id: number; name: string };

const key = 'Person';

let nextId = 0;

function personGenerator(amount: number) {
  return Array.from({ length: amount }, () => {
    nextId++;

    return {
      id: nextId,
      name: `Person ${nextId}`,
    };
  });
}

export const usePerson = createItemHook({
  key,
  getId: (data) => data.id,
  resolver: async (args: Pick<Person, 'id'>) => {
    return Promise.resolve({ id: args.id, name: 'Mike' });
  },
});

export const usePersonList = createListHook({
  key,
  getId: (data) => data.id,
  resolver: (_: undefined) => {
    return Promise.resolve(personGenerator(1));
  },
});

export const useNewPersons = createNewItemsHook<Person>({ key });

export const useCreatePerson = createMutationHook({
  key,
  getId: (data) => data.id,
  operation: 'create',
  resolver: async ({ name }: Person) => {
    nextId++;

    return Promise.resolve({ id: nextId, name });
  },
});

export const useUpdatePerson = createMutationHook({
  key,
  getId: (data) => data.id,
  operation: 'update',
  resolver: async ({ id, name }: Person) => {
    return Promise.resolve({ id, name });
  },
});

export const useDeletePerson = createMutationHook({
  key,
  getId: (data) => data.id,
  operation: 'delete',
  resolver: async ({ id }: Pick<Person, 'id'>) => {
    return Promise.resolve({ id });
  },
});
