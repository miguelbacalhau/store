import { CSSProperties } from 'react';

import { StoreEntry } from '../../factories/store';
import { Separator } from '../ui/Separator';
import { EntryDetailsExternals } from './EntryDetailsExternals';
import { EntryDetailsHeader } from './EntryDetailsHeader';
import { EntryDetailsInternals } from './EntryDetailsInternals';

type EntryDetailsProps = {
  entryKey: string;
  entry: StoreEntry;
};
export function EntryDetails({ entryKey, entry }: EntryDetailsProps) {
  return (
    <div style={entryDetailsStyle}>
      <EntryDetailsHeader entryKey={entryKey} />
      <Separator />
      <EntryDetailsExternals externals={entry.externals} />
      <Separator />
      <EntryDetailsInternals internals={entry.internals} />
    </div>
  );
}

const entryDetailsStyle: CSSProperties = {};
