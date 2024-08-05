import { CSSProperties } from 'react';

import { StoreEntry } from '../../factories/store';
import { space100 } from '../cssTokens/spacings';
import { ReferenceLink } from './ReferenceLink';

type EntryInternalsProps = {
  internals: StoreEntry['internals'];
};

export function EntryInternals({ internals }: EntryInternalsProps) {
  return (
    <div style={entryInternalsStyle}>
      <div>
        <div>
          {Array.from(internals.referencedBy).map((reference) => {
            const key = reference.referenceKey;
            return <ReferenceLink key={key} reference={reference} />;
          })}
        </div>
      </div>
    </div>
  );
}

const entryInternalsStyle: CSSProperties = {
  padding: `${space100}`,
};
