import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerProps,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

export function DevToolsDrawer({
  children,
  finalFocusRef,
  isOpen,
  onClose,
}: {
  children: ReactNode;
} & DrawerProps) {
  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={finalFocusRef}
        trapFocus={false}
        closeOnOverlayClick={false}
        size="md"
      >
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Store Dev Tools</DrawerHeader>

          <DrawerBody>{children}</DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
