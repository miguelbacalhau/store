import { Accordion } from '@chakra-ui/react';

import { globalStore } from '../globals/globalStore';
import { StoreEntry } from './StoreEntry';

export function StoreEntryList() {
  const entryKeys = Object.keys(globalStore);

  return (
    <Accordion allowToggle>
      {entryKeys.map((key) => {
        return <StoreEntry key={key} entryKey={key} />;
      })}
    </Accordion>
  );
}
