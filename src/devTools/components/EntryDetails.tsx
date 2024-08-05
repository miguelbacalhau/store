import { CSSProperties } from 'react';

import { StoreEntry } from '../../factories/store';
import { EntryExternals } from './EntryExternals';
import { EntryInternals } from './EntryInternals';

type EntryDetailsProps = {
  entry: StoreEntry;
};
export function EntryDetails({ entry }: EntryDetailsProps) {
  return (
    <div style={entryDetailsStyle}>
      <EntryExternals externals={entry.externals} />
      <EntryInternals internals={entry.internals} />
    </div>
  );
}

const entryDetailsStyle: CSSProperties = {};
