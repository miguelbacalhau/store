import { CSSProperties } from 'react';

import { StoreEntry } from '../../factories/store';
import { space100 } from '../cssTokens/spacings';
import { DataExplorer } from './DataExplorer';

type EntryExternalsProps = {
  externals: StoreEntry['externals'];
};

export function EntryExternals({ externals }: EntryExternalsProps) {
  return (
    <div style={entryExternalsStyle}>
      <div>
        <div>Data</div>
        <div>
          <DataExplorer data={externals.data} />
        </div>
      </div>
    </div>
  );
}

const entryExternalsStyle: CSSProperties = {
  padding: `${space100}`,
};
