import {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  useRef,
} from 'react';

type DraggableProps = {
  onDrag: (change: { x: number; y: number }) => void;
  style?: CSSProperties;
  cursor?: CSSProperties['cursor'];
  children?: ReactNode;
};

export function Draggable({
  style = {},
  cursor = 'drag',
  onDrag,
  children = null,
}: DraggableProps) {
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const handleDrag = (
    mouseDownEvent: ReactMouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    mouseDownEvent.preventDefault();

    mousePositionRef.current = {
      x: mouseDownEvent.pageX,
      y: mouseDownEvent.pageY,
    };

    function handleMouseMove(mouseMoveEvent: MouseEvent) {
      onDrag({
        x: mousePositionRef.current.x - mouseMoveEvent.pageX,
        y: mousePositionRef.current.y - mouseMoveEvent.pageY,
      });

      mousePositionRef.current = {
        x: mouseMoveEvent.pageX,
        y: mouseMoveEvent.pageY,
      };
    }

    function handleMouseMoveEnd() {
      document.body.removeEventListener('mousemove', handleMouseMove);
    }

    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseup', handleMouseMoveEnd, {
      once: true,
    });
    document.body.addEventListener('mouseleave', handleMouseMoveEnd, {
      once: true,
    });
  };

  return (
    <div style={{ ...style, cursor }} onMouseDown={handleDrag}>
      {children}
    </div>
  );
}
