import { CSSProperties } from 'react';

import { deconstructKey } from '../../factories/keys';
import { fontWeight500 } from '../cssTokens/fonts';
import { space100 } from '../cssTokens/spacings';
import { EntryType } from './EntryType';

type EntryHeaderProps = {
  entryKey: string;
};

export function EntryHeader({ entryKey }: EntryHeaderProps) {
  const [mainKey, typeKey, restKey] = deconstructKey(entryKey);

  return (
    <div style={entryHeaderStyle}>
      <div style={entryKeyStyle}>
        <EntryType typeKey={typeKey} />{' '}
        <div style={mainKeyStyle}>{mainKey}</div>
      </div>
    </div>
  );
}

const entryHeaderStyle: CSSProperties = {
  display: 'flex',
  padding: space100,
};

const entryKeyStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space100,
};

const mainKeyStyle: CSSProperties = {
  fontWeight: fontWeight500,
};
