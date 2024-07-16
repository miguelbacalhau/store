import './App.css';

import { createItem } from './store/createItem';
import { createListHook } from './store/useList';

const key = 'person';

const item = createItem({
  key,
  getId: (data) => data.id,
  resolver: () => ({ id: 1, name: 'Mike' }),
});

const useList = createListHook({
  key,
  getId: (data) => data.id,
  resolver: (name: string) =>
    Promise.resolve([
      { id: 1, name: 'Mike' },
      { id: 2, name: 'Maria' },
    ]),
});

function App() {
  const names = useList('bufa');

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
