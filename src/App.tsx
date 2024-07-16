import './App.css';

import { createItem } from './store/createItem';
import { useList } from './store/useList';

const item = createItem({
  key: 'count',
  getId: (data) => data.id,
  resolver: () => ({ id: 1, name: 'Mike' }),
});

function App() {
  const names = useList({
    key: 'count',
    getId: (data) => data.id,
    resolver: () =>
      Promise.resolve([
        { id: 1, name: 'Mike' },
        { id: 2, name: 'Maria' },
      ]),
  });

  return (
    <>
      <div className="card">{names?.map((name) => <p>{name.name}</p>)}</div>

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
