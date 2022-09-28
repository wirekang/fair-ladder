import { useEffect, useRef, useState } from "react";
import { ANIM_FACTOR } from "./utils/const";
import { randomInt, sleep } from "./utils/data";

interface Props {
  options: string[];
}

export function LadderRender(props: Props): JSX.Element {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) {
      return;
    }

    canvas.width = 1000;
    canvas.height = 1560;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.5;
    ctx.textAlign = "center";
    setCtx(ctx);
    renderCanvas(ctx, props.options);
  }, []);

  return (
    <canvas ref={ref} className="canvas" width={1000} height={2000}>
      지원안하는 브라우저
    </canvas>
  );
}

const lineStartX = 50;
const lineStartY = 100;
const lineMarginX = 60;
const lineMarginY = 3;
const rowCount = 450;

/**
 * true: 좌
 * false: 우
 * null: 아래
 */
type LadderPoint = true | false | null;

async function renderCanvas(ctx: CanvasRenderingContext2D, options: string[]) {
  const data: LadderPoint[][] = new Array(rowCount).fill(0).map(() =>
    options.map((_, i) => {
      switch (randomInt(9)) {
        case 0:
        case 1:
        case 2:
        case 3:
          if (i === 0) {
            return null;
          }
          return true;
        case 4:
        case 5:
        case 6:
        case 7:
          if (i === options.length - 1) {
            return null;
          }
          return false;
        default:
          return null;
      }
    }),
  );

  for (let i = 0; i < data.length; i += 1) {
    for (let j = 1; j < options.length - 1; j += 1) {
      const row = data[i][j];

      if (row === false) {
        if (data[i][j + 1] !== true) {
          data[i][j] = null;
        }
      } else if (row === true) {
        if (data[i][j - 1] !== false) {
          data[i][j] = null;
        }
      }
    }
  }

  let leftCount = 0;
  let rightCount = 0;
  let downCount = 0;
  for (let i = 0; i < data.length; i += 1) {
    for (let j = 1; j < options.length - 1; j += 1) {
      const row = data[i][j];

      if (row === false) {
        rightCount++;
      }

      if (row === true) {
        leftCount++;
      }
      if (row === null) {
        downCount++;
      }
    }
  }
  console.log(leftCount, rightCount, downCount);

  ctx.strokeStyle = "black";
  ctx.font = "20px monospace";

  for (let i = 0; i < options.length; i += 1) {
    const option = options[i];
    const x = lineStartX + lineMarginX * i;
    const yEnd = lineStartY + lineMarginY * (rowCount + 1);
    await lineTo(ctx, x, lineStartX, x, yEnd, 0, 10);
    ctx.strokeText(option.substring(0, 2), x, yEnd + 20);
    ctx.strokeText(option.substring(2, 4), x, yEnd + 40);
    ctx.strokeText(option.substring(4), x, yEnd + 60);
  }

  await sleep(2000);
  for (let i = 0; i < options.length; i += 1) {
    const x = lineStartX + lineMarginX * i;
    let y = lineStartY;
    for (let j = 0; j < data.length; j += 1) {
      const row = data[j][i];
      y += lineMarginY;
      switch (row) {
        case true:
          await lineTo(ctx, x, y, x - lineMarginX, y, -50, 0, undefined, true);
          break;
        case false:
          await lineTo(ctx, x, y, x + lineMarginX, y, 50, 0, undefined, true);
          break;
      }
    }
  }
  await sleep(2000);

  let startIndex = randomInt(options.length);
  {
    let x = 0;
    for (let i = 0; i < 100; i += 1) {
      startIndex = randomInt(options.length);
      x = lineStartX + startIndex * lineMarginX;
      const y = lineStartY - 25;
      ctx.strokeStyle = "red";
      ctx.clearRect(0, 0, 9999, y + 5);
      ctx.strokeText("시작", x, y);
      await sleep(100);
    }
    await sleep(2000);

    let y = lineStartY;
    ctx.strokeStyle = "red";
    let currentIndex = startIndex;
    await lineTo(ctx, x, y - 20, x, y + lineMarginY, 0, 3, 3);
    y += lineMarginY;
    for (let i = 0; i < data.length; i += 1) {
      const row = data[i][currentIndex];
      switch (row) {
        case true:
          await lineTo(ctx, x, y, x - lineMarginX, y, -2, 0, 3);
          currentIndex--;
          x -= lineMarginX;
          break;
        case false:
          await lineTo(ctx, x, y, x + lineMarginX, y, 2, 0, 3);
          currentIndex++;
          x += lineMarginX;
          break;
        default:
      }

      await lineTo(ctx, x, y, x, y + lineMarginY, 0, 2, 3);
      y += lineMarginY;
      await sleep(100);
    }
    ctx.font = "40px monospace";
    ctx.lineWidth = 3;
    ctx.strokeText(options[currentIndex], 500, 50);
  }
}

async function lineTo(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  xStep: number,
  yStep: number,
  lineWidth?: number,
  isArrow?: boolean,
) {
  xStep = xStep * ANIM_FACTOR;
  yStep = yStep * ANIM_FACTOR;
  let x = startX;
  let y = startY;
  let xFinish = false;
  let yFinish = false;
  while (true) {
    if (!xFinish && Math.abs(endX - x) <= Math.abs(xStep)) {
      x = endX;
      xFinish = true;
    } else {
      x += xStep;
    }

    if (!yFinish && Math.abs(endY - y) <= Math.abs(yStep)) {
      yFinish = true;
      y = endY;
    } else {
      y += yStep;
    }

    ctx.beginPath();
    ctx.lineWidth = lineWidth ?? 1.5;

    if (xFinish && yFinish) {
      if (false && isArrow) {
        canvas_arrow(ctx, startX, startY, x, y);
      } else {
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      break;
    } else {
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    await sleep(0);
  }
}

function canvas_arrow(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) {
  const head = 5;
  const dx = endX - startX;
  const dy = endY - startY;
  const angle = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.lineTo(endX - head * Math.cos(angle - Math.PI / 6), endY - head * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(endX, endY);
  ctx.lineTo(endX - head * Math.cos(angle + Math.PI / 6), endY - head * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}
