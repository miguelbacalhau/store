import { CSSProperties } from 'react';

import { StoreEntry } from '../../factories/store';
import { EntryExternals } from './EntryExternals';

type EntryDetailsProps = {
  entry: StoreEntry;
};
export function EntryDetails({ entry }: EntryDetailsProps) {
  return (
    <div style={entryDetailsStyle}>
      <EntryExternals externals={entry.externals} />
    </div>
  );
}

const entryDetailsStyle: CSSProperties = {};
