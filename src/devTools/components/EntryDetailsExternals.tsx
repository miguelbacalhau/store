import { CSSProperties } from 'react';

import { StoreEntry } from '../../factories/store';
import { fontWeight500 } from '../cssTokens/fonts';
import { space100 } from '../cssTokens/spacings';
import { Separator } from '../ui/Separator';
import { DataExplorer } from './DataExplorer';

type EntryExternalsProps = {
  externals: StoreEntry['externals'];
};

export function EntryDetailsExternals({ externals }: EntryExternalsProps) {
  return (
    <div>
      <div style={titleStyle}>Data</div>
      <Separator />
      <div style={externalsStyle}>
        <DataExplorer data={externals.data} />
      </div>
    </div>
  );
}

const titleStyle: CSSProperties = {
  padding: `${space100}`,
  fontWeight: fontWeight500,
  borderRight: '1px solid black',
};

const externalsStyle: CSSProperties = {
  padding: `${space100}`,
  borderRight: '1px solid black',
};
