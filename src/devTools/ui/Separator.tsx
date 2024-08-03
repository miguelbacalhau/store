import { CSSProperties } from 'react';

import { space25, space100 } from '../cssTokens/spacings';

export function Separator() {
  return <div style={resizerStyle} />;
}

const resizerStyle: CSSProperties = {
  width: '100%',
  height: space25,
  margin: `${space100} 0 ${space100} 0`,
  backgroundColor: 'black',
};
