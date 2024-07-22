import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';

import { useStoreEntry } from './useStoreEntry';

export function StoreEntry({ entryKey }: { entryKey: string }) {
  const entry = useStoreEntry(entryKey);

  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            {entryKey}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <pre>{JSON.stringify(entry, null, 2)}</pre>
      </AccordionPanel>
    </AccordionItem>
  );
}
