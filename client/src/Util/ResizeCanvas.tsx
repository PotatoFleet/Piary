const resizeCanvas: Function = (
  canvas: HTMLCanvasElement,
  width: number = document.body.clientWidth / 2,
  height: number = document.body.clientHeight
): void => {
  canvas.width = width;
  canvas.height = height;
};

export default resizeCanvas;
