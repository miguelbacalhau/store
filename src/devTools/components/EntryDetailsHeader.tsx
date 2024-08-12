import { CSSProperties } from 'react';

import { deconstructKey } from '../../factories/keys';
import { EntryInlineInfo } from './EntryInlineInfo';

type EntryHeaderProps = {
  entryKey: string;
};

export function EntryDetailsHeader({ entryKey }: EntryHeaderProps) {
  const [mainKey, typeKey, restKey] = deconstructKey(entryKey);

  return (
    <div>
      <EntryInlineInfo mainKey={mainKey} typeKey={typeKey} restKey={restKey} />
    </div>
  );
}

const entryHeaderStyle: CSSProperties = {
  display: 'flex',
};
