import React, { useRef, useEffect } from "react";
import supportsPassive from "./supportsPassive";
import Animator from "./animator";

type CanvasProps = {
  draw: (canvasElement: HTMLCanvasElement, timeDelta?: number) => void;
  animate?: boolean;
} & JSX.IntrinsicAttributes &
  React.ClassAttributes<HTMLCanvasElement> &
  React.CanvasHTMLAttributes<HTMLCanvasElement>;

const eventOptions = supportsPassive ? { passive: true } : false;

export const useCanvas = (draw: (canvasElement: HTMLCanvasElement, timeDelta?: number) => void, animate = false) => {
  const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> = useRef(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const { devicePixelRatio: ratio = 1 } = window;
    const callbacks: (() => void)[] = [];

    if (canvasElement) {
      const resize = () => {
        const { width, height } = canvasElement.getBoundingClientRect();

        if (canvasElement.width !== width || canvasElement.height !== height) {
          canvasElement.width = width * ratio;
          canvasElement.height = height * ratio;

          draw(canvasElement);
        }
      };

      resize();

      window.addEventListener("resize", resize, eventOptions);
      canvasElement.addEventListener("resize", resize, eventOptions);

      callbacks.push(() => {
        window.removeEventListener("resize", resize);
        canvasElement.removeEventListener("resize", resize);
      });

      if (animate) {
        const animator = new Animator({ pauseOnHidden: false });

        callbacks.push(animator.add(timeDelta => draw(canvasElement, timeDelta)));

        animator.start();
      }
    }

    return () => callbacks.forEach(callback => callback());
  }, [draw, animate]);

  return canvasRef;
};

const Canvas = (props: CanvasProps) => {
  const { draw, animate, ...rest } = props;
  const canvasRef = useCanvas(draw, animate);

  return <canvas ref={canvasRef} {...rest} />;
};

export default Canvas;
