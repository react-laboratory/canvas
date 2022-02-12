import Canvas from "./canvas";

import "./style.css";

const App = () => {
  let frameCount = 0;

  const draw = (canvasElement: HTMLCanvasElement, timeDelta?: number) => {
    const context = canvasElement.getContext("2d");

    if (context && timeDelta) {
      frameCount += timeDelta;
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.fillStyle = "#000000";
      context.beginPath();
      context.arc(50, 100, 20 * Math.sin(frameCount * 0.005) ** 2, 0, 2 * Math.PI);
      context.fill();
    }
  };

  return <Canvas draw={draw} animate={true} />;
};

export default App;
