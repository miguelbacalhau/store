import { CSSProperties } from 'react';

import { StoreEntry } from '../../factories/store';
import { Separator } from '../ui/Separator';
import { EntryExternals } from './EntryExternals';
import { EntryHeader } from './EntryHeader';
import { EntryInternals } from './EntryInternals';

type EntryDetailsProps = {
  entryKey: string;
  entry: StoreEntry;
};
export function EntryDetails({ entryKey, entry }: EntryDetailsProps) {
  console.log(entryKey);
  return (
    <div style={entryDetailsStyle}>
      <EntryHeader entryKey={entryKey} entry={entry} />
      <Separator />
      <EntryExternals externals={entry.externals} />
      <Separator />
      <EntryInternals internals={entry.internals} />
    </div>
  );
}

const entryDetailsStyle: CSSProperties = {};
