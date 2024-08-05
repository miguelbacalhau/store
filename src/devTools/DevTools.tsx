import { CSSProperties, useState } from 'react';

import { deconstructKey } from '../factories/keys';
import { StoreEntry } from '../factories/store';
import { useStore } from '../hooks/useStore';
import { EntryDetails } from './components/EntryDetails';
import { EntryInfo } from './components/EntryInfo';
import { QuickFilter } from './components/QuickFilters';
import { grayscaleBlack } from './cssTokens/colors';
import { Button } from './ui/Button';
import { Drawer } from './ui/Drawer';

export function DevTools() {
  const { store, listeners } = useStore();

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
            {filteredEntries.map(([key, entry]) => {
              const listenerCount = listeners.listenerMap[key]?.length;

              const [mainKey, typeKey, restKey] = deconstructKey(key);

              return (
                <EntryInfo
                  key={key}
                  mainKey={mainKey}
                  typeKey={typeKey}
                  restKey={restKey}
                  listenerCount={listenerCount}
                  onClick={() => setSelectedEntry(entry)}
                />
              );
            })}
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
};

const headerStyle: CSSProperties = {};

const listStyle: CSSProperties = {
  display: 'grid',
  gridTemplateRows: '1fr',
  backgroundColor: grayscaleBlack,
  border: `1px solid ${grayscaleBlack}`,
  gap: '1px',
};

const detailsStyle: CSSProperties = {
  borderTop: `1px solid ${grayscaleBlack}`,
};
