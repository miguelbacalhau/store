import { CSSProperties } from 'react';

import {
  error200,
  grayscale25Gray,
  grayscale100Gray,
  grayscaleBlack,
  grayscaleWhite,
  info400,
  primary200,
  success200,
  warning200,
} from '../cssTokens/colors';
import { space100, space200 } from '../cssTokens/spacings';
import { Hover } from '../ui/Hover';
import { fontWeight500 } from '../cssTokens/fonts';

type EntryInfoProps = {
  mainKey: string;
  typeKey: string;
  restKey?: string;
  listenerCount: number | undefined;
  onClick: () => void;
};
export function EntryInfo({
  mainKey,
  typeKey,
  restKey,
  listenerCount,
  onClick,
}: EntryInfoProps) {
  const listenerCountNumber = listenerCount ?? 0;
  const listenerCountColor = {
    backgroundColor: listenerCountNumber > 0 ? success200 : warning200,
  };

  const typeKeyColor = {
    backgroundColor: typeKey === 'list' ? primary200 : info400,
  };

  return (
    <Hover
      normalColor={grayscaleWhite}
      hoverColor={grayscale25Gray}
      pressedColor={grayscale100Gray}
    >
      <div style={entryStyle} onClick={onClick}>
        <div style={{ ...listenerCountStyle, ...listenerCountColor }}>
          {listenerCountNumber}
        </div>
        <div style={{ ...listenerCountStyle, ...typeKeyColor }}>{typeKey}</div>
        <div style={{ ...entryKeyStyle, ...mainKeyStyle }}>{mainKey}</div>
        <div style={entryKeyStyle}>
          {getTypeText(typeKey)}
          {': '}
          <span style={restKeyValueStyle}>{restKey}</span>
        </div>
      </div>
    </Hover>
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
  gridTemplateColumns: '1fr 1fr 6fr 6fr',
};

const entryKeyStyle: CSSProperties = {
  padding: `${space100} ${space100} ${space100} ${space200}`,
  borderRight: `1px solid ${grayscaleBlack}`,
};

const listenerCountStyle: CSSProperties = {
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
