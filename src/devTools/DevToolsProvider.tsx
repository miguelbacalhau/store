import { Button, ChakraProvider, useDisclosure } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import { useRef } from 'react';

import { DevToolsDrawer } from './DevtoolsDrawer';
import { drawerTheme } from './DevtoolsDrawer.theme';
import { StoreEntryList } from './StoreEntryList';

export const theme = extendTheme({
  components: { Drawer: drawerTheme },
});

export function DevToolsProvider() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <ChakraProvider theme={theme}>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Open
      </Button>
      <DevToolsDrawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <StoreEntryList />
      </DevToolsDrawer>
    </ChakraProvider>
  );
}
