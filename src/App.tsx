import { useSyncExternalStore } from 'react';
import './App.css';
import { createList } from './store/createList';
import { createItem } from './store/createItem';

const list = createList({
  key: 'count',
  getId: (data) => data.id,
  resolver: () => [
    { id: 1, name: 'Mike' },
    { id: 2, name: 'Maria' },
  ],
});

const item = createItem({
  key: 'count',
  getId: (data) => data.id,
  resolver: () => ({ id: 1, name: 'Mike' }),
});

function App() {
  const names = useSyncExternalStore(list.subscribe, list.getSnapshot);

  return (
    <>
      <div className="card">
        {names.map((name) => (
          <p>{name.name}</p>
        ))}
      </div>

      <button
        onClick={() => {
          item.setState({ id: 1, name: 'Ze' });
        }}
      >
        change
      </button>
    </>
  );
}

export default App;
