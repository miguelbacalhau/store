import { CSSProperties, ReactNode, RefObject, useEffect, useRef } from 'react';

import { radius50 } from '../../src/devTools/cssTokens/radius';
import { space300 } from '../../src/devTools/cssTokens/spacings';

type PopoverProps<TElement> = {
  triggerRef: RefObject<TElement>;
  children: ReactNode;
};

export function Popover<TElement extends HTMLElement>({
  triggerRef,
  children,
}: PopoverProps<TElement>) {
  const popoverRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (triggerRef.current) {
      triggerRef.current.onclick = () => {
        handleToggle();
      };
    }
  }, [triggerRef]);

  function handleToggle() {
    popoverRef.current?.togglePopover();
  }
  function handleClose() {
    popoverRef.current?.hidePopover();
  }

  return (
    // @ts-expect-error popover not supported by typescript yet
    <dialog popover="true" style={popoverStyle} ref={popoverRef}>
      <button onClick={handleClose}>x</button>
      {children}
    </dialog>
  );
}

const popoverStyle: CSSProperties = {
  height: '40vh',
  width: '60vw',
  padding: space300,
  borderRadius: radius50,
};
