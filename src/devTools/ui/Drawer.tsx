import { CSSProperties, ReactNode, useState } from 'react';

import { grayscaleWhite } from '../cssTokens/colors';
import { space200 } from '../cssTokens/spacings';
import { Button } from './Button';
import { Draggable } from './Draggable';

type DrawerProps = {
  onClose: () => void;
  initialSize: number;
  children: ReactNode;
};

export function Drawer({ onClose, initialSize, children }: DrawerProps) {
  const [size, setSize] = useState(initialSize);

  function handleResize({ y }: { y: number }) {
    setSize((prevSize) => {
      const newSize = prevSize + y;

      if (newSize > 500 || newSize < 150) {
        return prevSize;
      }
      return newSize;
    });
  }
  return (
    <div style={{ ...drawerStyle, height: size }}>
      <Draggable
        cursor="row-resize"
        style={resizerSize}
        onDrag={handleResize}
      />
      <div style={{ ...drawerContentStyle }}>
        <div>
          <Button onClick={onClose}>Close</Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

const drawerStyle: CSSProperties = {
  position: 'fixed',
  bottom: 0,
  right: 0,
  left: 0,
};

const drawerContentStyle: CSSProperties = {
  backgroundColor: grayscaleWhite,
  border: '1px solid black',
  padding: space200,
  height: '100%',
  overflow: 'scroll',
};

const resizerSize: CSSProperties = {
  height: space200,
};
