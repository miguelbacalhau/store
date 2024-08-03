import { CSSProperties, ReactNode, useState } from 'react';

type HoverProps = {
  normalColor: string;
  hoverColor: string;
  pressedColor: string;
  children: ReactNode;
};
export function Hover({
  normalColor,
  hoverColor,
  pressedColor,
  children,
}: HoverProps) {
  const [state, setState] = useState<'normal' | 'hover' | 'pressed'>('normal');

  function handleHover() {
    setState('hover');
  }

  function handlePress() {
    setState('pressed');
  }

  function handleNormal() {
    setState('normal');
  }

  const colors = {
    normal: normalColor,
    hover: hoverColor,
    pressed: pressedColor,
  };

  const colorStyle: CSSProperties = {
    backgroundColor: colors[state],
  };

  return (
    <div
      style={colorStyle}
      onMouseEnter={handleHover}
      onMouseLeave={handleNormal}
      onMouseDown={handlePress}
      onMouseUp={handleHover}
    >
      {children}
    </div>
  );
}
