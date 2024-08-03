import { CSSProperties } from 'react';

import {
  grayscale25Gray,
  grayscale100Gray,
  grayscaleBlack,
  grayscaleWhite,
  success200,
  warning200,
} from '../cssTokens/colors';
import { space100, space200 } from '../cssTokens/spacings';
import { Hover } from '../ui/Hover';

type EntryProps = {
  entryKey: string;
  listenerCount: number | undefined;
  onSelect: (entry: string) => void;
};
export function Entry({ entryKey, listenerCount, onSelect }: EntryProps) {
  const listenerCountNumber = listenerCount ?? 0;
  const listenerCountColor = {
    backgroundColor: listenerCountNumber > 0 ? success200 : warning200,
  };

  return (
    <Hover
      normalColor={grayscaleWhite}
      hoverColor={grayscale25Gray}
      pressedColor={grayscale100Gray}
    >
      <div style={entryStyle} onClick={() => onSelect(entryKey)}>
        <div
          style={{ ...listenerCountStyle, ...listenerCountColor }}
          onClick={() => onSelect(entryKey)}
        >
          {listenerCountNumber}
        </div>
        <div style={entryKeyStyle} onClick={() => onSelect(entryKey)}>
          {entryKey}
        </div>
      </div>
    </Hover>
  );
}

const entryStyle: CSSProperties = {
  display: 'flex',
};

const entryKeyStyle: CSSProperties = {
  padding: `${space100} ${space100} ${space100} ${space200}`,
};

const listenerCountStyle: CSSProperties = {
  padding: `${space100} ${space200} ${space100} ${space200}`,
  borderRight: `1px solid ${grayscaleBlack}`,
  color: grayscaleWhite,
  fontWeight: 700,
};
