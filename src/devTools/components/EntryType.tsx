import { CSSProperties } from 'react';

import { grayscaleWhite, info400, primary200 } from '../cssTokens/colors';
import { fontWeight500 } from '../cssTokens/fonts';
import { space100, space200 } from '../cssTokens/spacings';

type EntryTypeProps = {
  typeKey: string;
};
export function EntryType({ typeKey }: EntryTypeProps) {
  const typeKeyColor = {
    backgroundColor: typeKey === 'list' ? primary200 : info400,
  };

  return <div style={{ ...entryTypeStyle, ...typeKeyColor }}>{typeKey}</div>;
}

const entryTypeStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  padding: `${space100} ${space200} ${space100} ${space200}`,
  color: grayscaleWhite,
  fontWeight: fontWeight500,
};
