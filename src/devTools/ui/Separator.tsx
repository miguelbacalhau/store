import { CSSProperties } from 'react';

export function Separator() {
  return <div style={separatorStyle} />;
}

const separatorStyle: CSSProperties = {
  width: '100%',
  height: '1px',
  backgroundColor: 'black',
};
