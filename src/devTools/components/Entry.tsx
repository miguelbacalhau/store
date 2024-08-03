import { CSSProperties } from 'react';

import {
  grayscale25Gray,
  grayscale100Gray,
  grayscaleWhite,
} from '../cssTokens/colors';
import { space100 } from '../cssTokens/spacings';
import { Hover } from '../ui/Hover';

type EntryProps = {
  entryKey: string;
  onSelect: (entry: string) => void;
};
export function Entry({ entryKey, onSelect }: EntryProps) {
  return (
    <Hover
      normalColor={grayscaleWhite}
      hoverColor={grayscale25Gray}
      pressedColor={grayscale100Gray}
    >
      <div style={entryStyle} onClick={() => onSelect(entryKey)}>
        {entryKey}
      </div>
    </Hover>
  );
}

const entryStyle: CSSProperties = {
  padding: `${space100} 0 ${space100} 0`,
};
