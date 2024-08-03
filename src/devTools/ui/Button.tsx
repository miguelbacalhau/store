import { CSSProperties, ReactNode, useState } from 'react';

import {
  grayscale25Gray,
  grayscale100Gray,
  grayscale200Gray,
  grayscaleBlack,
  grayscaleWhite,
  primary200,
  primary300,
  primary400,
  secondary200,
  secondary300,
  secondary400,
} from '../cssTokens/colors';
import { radius50 } from '../cssTokens/radius';
import { space100, space200 } from '../cssTokens/spacings';

type Variant = 'primary' | 'secondary' | 'grey';

type ButtonProps = {
  variant?: Variant;
  children: ReactNode;
  onClick: () => void;
};

export function Button({
  variant = 'primary',
  children,
  onClick,
}: ButtonProps) {
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

  const variantColors = getVariantColor(variant);
  const variantStyle = getVariantStyle(variant);

  const variantFinalStyle = {
    backgroundColor: variantColors[state],
    ...variantStyle,
  };

  return (
    <button
      style={{ ...buttonStyle, ...variantFinalStyle }}
      onMouseEnter={handleHover}
      onMouseLeave={handleNormal}
      onMouseDown={handlePress}
      onMouseUp={handleHover}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

const clearStyle: CSSProperties = {
  background: 'none',
  color: 'inherit',
  border: 'none',
  padding: 0,
  font: 'inherit',
  cursor: 'pointer',
  outline: 'inherit',
};

const buttonStyle: CSSProperties = {
  ...clearStyle,

  color: grayscaleWhite,
  fontWeight: 600,
  padding: `${space100} ${space200} ${space100} ${space200}`,
  borderRadius: radius50,
};

function getVariantColor(variant: Variant) {
  if (variant === 'primary') {
    return { normal: primary200, hover: primary300, pressed: primary400 };
  }
  if (variant === 'secondary') {
    return { normal: secondary200, hover: secondary300, pressed: secondary400 };
  }

  return {
    normal: grayscaleWhite,
    hover: grayscale25Gray,
    pressed: grayscale100Gray,
  };
}
function getVariantStyle(variant: Variant) {
  if (variant === 'grey') {
    return { color: grayscaleBlack, border: `1px solid ${grayscale200Gray}` };
  }

  return {};
}
