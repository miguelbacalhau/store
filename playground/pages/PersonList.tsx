import { usePersonList } from '../state/person';

export function PersonList() {
  const persons = usePersonList();

  return (
    <div>
      {persons.isLoading && <p>Loading...</p>}
      <div>
        {persons.data?.map((person) => <p key={person?.id}>{person?.name}</p>)}
      </div>
    </div>
  );
}
