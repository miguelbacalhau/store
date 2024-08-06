import { CSSProperties } from 'react';

import { space50 } from '../cssTokens/spacings';
import { Button } from '../ui/Button';
import { fontWeight500 } from '../cssTokens/fonts';

type QuickFilterProps = {
  filters: string[];
  onSelect: (filter: string) => void;
};
export function QuickFilter({ filters, onSelect }: QuickFilterProps) {
  return (
    <div style={quickFilterStyle}>
      <div style={titleStyle}>Quick filters:</div>
      {filters.map((filter) => (
        <Button
          key={filter}
          variant="grey"
          onClick={() => {
            onSelect(filter);
          }}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}

const quickFilterStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space50,
  padding: `${space50} 0 ${space50} 0`,
};

const titleStyle: CSSProperties = {
  fontWeight: fontWeight500,
  paddingRight: `${space50}`,
};
