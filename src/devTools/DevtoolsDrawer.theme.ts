import { drawerAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  dialog: {
    pointerEvents: 'auto',
  },
  dialogContainer: {
    pointerEvents: 'none',
  },
});

export const drawerTheme = defineMultiStyleConfig({
  baseStyle,
});
