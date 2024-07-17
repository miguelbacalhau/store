import './App.css';

import { useState } from 'react';

import { createItemHook } from './store/createItemHook';
import { createListHook } from './store/createListHook';

const key = 'person';

const useItem = createItemHook({
  key,
  getId: (data) => data.id,
  resolver: (args: { id: number }) => {
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

function App() {
  const [showPerson, setShowPerson] = useState(false);
  const persons = useList('bufa');

  return (
    <>
      <div className="card">
        {persons.data?.map((person) => <p key={person?.id}>{person?.name}</p>)}
      </div>
      <button onClick={() => setShowPerson(true)}> Show Person </button>
      {showPerson && <Person />}
    </>
  );
}

function Person() {
  const person = useItem({ id: 1 });

  return (
    <div>
      <div className="card">{person.data?.name}</div>

      <button
        onClick={() => person.mutate({ name: `Person ${Math.random()}` })}
      >
        Change Name
      </button>
    </div>
  );
}

export default App;
