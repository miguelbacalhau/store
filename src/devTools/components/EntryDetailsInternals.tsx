import { CSSProperties } from 'react';

import { StoreEntry } from '../../factories/store';
import { fontWeight500 } from '../cssTokens/fonts';
import { space100 } from '../cssTokens/spacings';
import { Separator } from '../ui/Separator';
import { ReferenceLink } from './ReferenceLink';

type EntryInternalsProps = {
  internals: StoreEntry['internals'];
};

export function EntryDetailsInternals({ internals }: EntryInternalsProps) {
  return (
    <div>
      <div style={titleStyle}>Internals</div>
      <Separator />
      <div style={internalsStyle}>
        {Array.from(internals.referencedBy).map((reference) => {
          const key = reference.referenceKey;
          return <ReferenceLink key={key} reference={reference} />;
        })}
      </div>
    </div>
  );
}

const titleStyle: CSSProperties = {
  padding: `${space100}`,
  fontWeight: fontWeight500,
};
const internalsStyle: CSSProperties = {
  padding: `${space100}`,
};
