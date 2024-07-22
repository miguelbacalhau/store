import { useState } from 'react';

import { createItemHook } from './store/createItemHook';
import { createListHook } from './store/createListHook';
import { createMutation } from './store/createMutation';
import { DevToolsProvider } from './devTools/DevToolsProvider';

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

const createPerson = createMutation({
  key,
  getId: (data) => data.id,
  operation: 'create',
  resolver: async ({ id, name }: { id: number; name: string }) => {
    return Promise.resolve({ id, name });
  },
});

const updatePerson = createMutation({
  key,
  getId: (data) => data.id,
  operation: 'update',
  resolver: async ({ id, name }: { id: number; name: string }) => {
    return Promise.resolve({ id, name });
  },
});

const deletePerson = createMutation({
  key,
  getId: (data) => data.id,
  operation: 'delete',
  resolver: async ({ id }: { id: number }) => {
    return Promise.resolve({ id });
  },
});

function App() {
  const [showPerson, setShowPerson] = useState(false);
  const persons = useList('bufa');

  return (
    <>
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
      {persons.isLoading && <p>Loading...</p>}
      <div className="card">
        {persons.data?.map((person) => <p key={person?.id}>{person?.name}</p>)}
      </div>
      <button onClick={() => setShowPerson(true)}> Show Person </button>
      {showPerson && <Person />}
      <DevToolsProvider />
    </>
  );
}

function Person() {
  const person1 = useItem({ id: 1 });
  const person2 = useItem({ id: 3 });

  return (
    <div>
      {person1.isLoading && <p>Loading...</p>}
      <div className="card">{person1.data?.name}</div>
      <button
        onClick={() => updatePerson({ id: 1, name: `Person ${Math.random()}` })}
      >
        Update
      </button>
      <button onClick={() => deletePerson({ id: 1 })}>Delete</button>

      {person2.isLoading && <p>Loading...</p>}
      <div className="card">{person2.data?.name}</div>
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
