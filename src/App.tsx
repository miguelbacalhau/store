import { useState } from 'react';

import { DevToolsProvider } from './devTools/DevToolsProvider';
import { createItemHook } from './hooks/createItemHook';
import { createListHook } from './hooks/createListHook';
import { createMutationHook } from './hooks/createMutationHook';

const key = 'person';

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const useItem = createItemHook({
  key,
  getId: (data) => data.id,
  resolver: async (args: { id: number }) => {
    console.log('fetch item');

    return Promise.resolve({ id: args.id, name: 'Mike' });
  },
});

const useList = createListHook({
  key,
  getId: (data) => data.id,
  resolver: (name: string) => {
    console.log('fetch list');

    return Promise.resolve([
      { id: 1, name: 'Mike' },
      { id: 2, name: 'Maria' },
    ]);
  },
});

const useCreatePerson = createMutationHook({
  key,
  getId: (data) => data.id,
  operation: 'create',
  resolver: async ({ id, name }: { id: number; name: string }) => {
    return Promise.resolve({ id, name });
  },
});

const useUpdatePerson = createMutationHook({
  key,
  getId: (data) => data.id,
  operation: 'update',
  resolver: async ({ id, name }: { id: number; name: string }) => {
    return Promise.resolve({ id, name });
  },
});

const useDeletePerson = createMutationHook({
  key,
  getId: (data) => data.id,
  operation: 'delete',
  resolver: async ({ id }: { id: number }) => {
    return Promise.resolve({ id });
  },
});

function App() {
  const [showPerson, setShowPerson] = useState(false);

  return (
    <>
      <List />
      <button onClick={() => setShowPerson(true)}> Show Person </button>
      {showPerson && <Person />}
      <Buttons />
    </>
  );
}

function List() {
  const persons = useList('bufa');

  return (
    <>
      {persons.isLoading && <p>Loading...</p>}
      <div className="card">
        {persons.data?.map((person) => <p key={person?.id}>{person?.name}</p>)}
      </div>
    </>
  );
}

function Person() {
  const person1 = useItem({ id: 1 });
  const person2 = useItem({ id: 3 });

  return (
    <div>
      {person1?.isLoading && <p>Loading...</p>}
      <div className="card">{person1?.data?.name}</div>

      {person2?.isLoading && <p>Loading...</p>}
      <div className="card">{person2?.data?.name}</div>
    </div>
  );
}

function Buttons() {
  const { mutation: createPerson } = useCreatePerson();
  const { mutation: updatePerson } = useUpdatePerson();
  const { mutation: deletePerson } = useDeletePerson();

  return (
    <div>
      <button
        onClick={() =>
          createPerson({
            id: Math.floor(Math.random() * 1000),
            name: `Person ${Math.random()}`,
          })
        }
      >
        Create
      </button>
      <button
        onClick={() => updatePerson({ id: 1, name: `Person ${Math.random()}` })}
      >
        Update
      </button>
      <button onClick={() => deletePerson({ id: 1 })}>Delete</button>

      <button
        onClick={() => updatePerson({ id: 3, name: `Person ${Math.random()}` })}
      >
        Update
      </button>
      <button onClick={() => deletePerson({ id: 3 })}>Delete</button>
    </div>
  );
}

export default App;
