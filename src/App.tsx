import { useState } from 'react';

import { createItemHook } from './hooks/createItemHook';
import { createListHook } from './hooks/createListHook';
import { createMutationHook } from './hooks/createMutationHook';
import { createNewItemsHook } from './hooks/createNewItemsHook';

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type Person = { id: number; name: string };

const key = 'person';

const useItem = createItemHook({
  key,
  getId: (data) => data.id,
  resolver: async (args: Pick<Person, 'id'>) => {
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

const useNewItems = createNewItemsHook<Person>({ key });

const useCreatePerson = createMutationHook({
  key,
  getId: (data) => data.id,
  operation: 'create',
  resolver: async ({ id, name }: Person) => {
    return Promise.resolve({ id, name });
  },
});

const useUpdatePerson = createMutationHook({
  key,
  getId: (data) => data.id,
  operation: 'update',
  resolver: async ({ id, name }: Person) => {
    await timeout(2 * 1000);
    return Promise.resolve({ id, name });
  },
});

const useDeletePerson = createMutationHook({
  key,
  getId: (data) => data.id,
  operation: 'delete',
  resolver: async ({ id }: Pick<Person, 'id'>) => {
    return Promise.resolve({ id });
  },
});

function App() {
  const [showPerson, setShowPerson] = useState(false);

  return (
    <>
      <NewItems />
      <List />
      <button onClick={() => setShowPerson(true)}> Show Person </button>
      {showPerson && (
        <>
          <Person1 />
          <Person3 />
        </>
      )}
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

function NewItems() {
  const persons = useNewItems();

  return (
    <>
      {persons.isLoading && <p>Loading...</p>}
      <div className="card">
        {persons.data?.map((person) => <p key={person?.id}>{person?.name}</p>)}
      </div>
    </>
  );
}
function Person1() {
  const person = useItem({ id: 1 }, (state) => state.data);

  console.log('Person 1 rendered');
  return (
    <div>
      <div className="card">{person?.name}</div>
    </div>
  );
}
function Person3() {
  const person = useItem({ id: 3 });

  console.log('Person 2 rendered');
  return (
    <div>
      <div className="card">{person.data?.name}</div>
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
