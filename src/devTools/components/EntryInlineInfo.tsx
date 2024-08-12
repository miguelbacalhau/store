import { CSSProperties } from 'react';

import {
  error200,
  grayscaleBlack,
  grayscaleWhite,
  info400,
  primary200,
} from '../cssTokens/colors';
import { fontWeight500 } from '../cssTokens/fonts';
import { space100, space200 } from '../cssTokens/spacings';

type EntryInfoProps = {
  mainKey: string;
  typeKey: string;
  restKey?: string;
};
export function EntryInlineInfo({ mainKey, typeKey, restKey }: EntryInfoProps) {
  const typeKeyColor = {
    backgroundColor: typeKey === 'list' ? primary200 : info400,
  };

  return (
    <div style={entryStyle}>
      <div style={{ ...typeStyle, ...typeKeyColor }}>{typeKey}</div>
      <div style={{ ...entryKeyStyle, ...mainKeyStyle }}>{mainKey}</div>
      <div style={entryKeyStyle}>
        {getTypeText(typeKey)}
        {': '}
        <span style={restKeyValueStyle}>{restKey}</span>
      </div>
    </div>
  );
}

function getTypeText(typeKey: string) {
  if (typeKey === 'item') {
    return 'id';
  }
  if (typeKey === 'list') {
    return 'args';
  }
}

const entryStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 6fr',
};

const entryKeyStyle: CSSProperties = {
  padding: `${space100} ${space100} ${space100} ${space200}`,
  borderRight: `1px solid ${grayscaleBlack}`,
};

const typeStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  padding: `${space100} ${space200} ${space100} ${space200}`,
  borderRight: `1px solid ${grayscaleBlack}`,
  color: grayscaleWhite,
  fontWeight: fontWeight500,
};

const mainKeyStyle: CSSProperties = {
  fontWeight: fontWeight500,
};

const restKeyValueStyle: CSSProperties = {
  color: error200,
};
