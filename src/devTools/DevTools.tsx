import { CSSProperties, useState } from 'react';

import { deconstructKey } from '../factories/keys';
import { StoreEntry } from '../factories/store';
import { useStore } from '../hooks/useStore';
import { Entry } from './components/Entry';
import { EntryDetails } from './components/EntryDetails';
import { QuickFilter } from './components/QuickFilters';
import { space100 } from './cssTokens/spacings';
import { Button } from './ui/Button';
import { Drawer } from './ui/Drawer';

export function DevTools() {
  const { store } = useStore();

  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<StoreEntry | null>(null);

  function handleVisibility() {
    setIsVisible((prevIsVisible) => !prevIsVisible);
  }

  const storeEntries = Object.entries(store.store);
  const filteredEntries = filter
    ? storeEntries.filter(([key]) => {
        const mainKey = deconstructKey(key)[0];

        return mainKey === filter;
      })
    : storeEntries;

  const mainKeys = Array.from(
    new Set(storeEntries.map(([key]) => deconstructKey(key)[0])),
  );

  if (!isVisible) {
    return <Button onClick={handleVisibility}>Dev tools</Button>;
  }

  return (
    <>
      <Drawer initialSize={400} onClose={handleVisibility}>
        <div style={headerStyle}>
          <QuickFilter
            filters={mainKeys}
            onSelect={(filter) => setFilter(filter)}
          />
        </div>
        <div style={layoutStyle}>
          <div style={listStyle}>
            {filteredEntries.map(([key, entry]) => (
              <Entry
                key={key}
                entryKey={key}
                onSelect={() => setSelectedEntry(entry)}
              />
            ))}
          </div>
          <div style={detailsStyle}>
            {selectedEntry && <EntryDetails entry={selectedEntry} />}
          </div>
        </div>
      </Drawer>
    </>
  );
}

const layoutStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `1fr 1fr`,
  // gridTemplateAreas: `
  //   'header header header'
  //   'list details details'
  //   `,
  gap: space100,
};

const headerStyle: CSSProperties = {
  // gridArea: 'header',
};

const listStyle: CSSProperties = {
  // gridArea: 'list',
  display: 'flex',
  flexDirection: 'column',
};

const detailsStyle: CSSProperties = {
  // gridArea: 'details',
};
