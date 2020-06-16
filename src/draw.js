const amplitude = 30;

function getSourceRect(image, srcW, srcH) {
  const destW = image.naturalWidth;
  const destH = image.naturalHeight;

  const scale = Math.min(destW / srcW, destH / srcH);

  const scaledSrcW = srcW * scale;
  const scaledSrcH = srcH * scale;

  const startX = (destW - scaledSrcW) * 0.5;
  const startY = (destH - scaledSrcH) * 0.5;
  return {
    x: startX,
    y: startY,
    w: scaledSrcW,
    h: scaledSrcH,
  };
}

function sqsin(value) {
  const rest = value % 2;
  if (rest > 1) return 2 - rest;
  return rest;
}

function drawImage(ctx, image, flip, x, y, w, h, time, speed) {
  ctx.save();

  const hW = w / 2;
  const hH = h / 2;
  const sourceRect = getSourceRect(image, w, h);

  ctx.translate(x, y);
  ctx.translate(hW, hH);
  ctx.scale(flip ? -1 : 1, 1);

  const scaleFactor = amplitude / image.naturalWidth;

  const anim = sqsin((time / 7000) * speed);

  const stepX = image.naturalWidth * scaleFactor;
  const stepY = image.naturalHeight * scaleFactor;

  const scaleAnim = 1 - anim * 0.1;

  ctx.drawImage(
    image,
    sourceRect.x + stepX - anim * amplitude,
    sourceRect.y + stepY,
    (sourceRect.w - stepX) * scaleAnim,
    (sourceRect.h - stepY) * scaleAnim,
    -hW,
    -hH,
    w,
    h
  );

  ctx.restore();
}

export function draw(context, size, image, time, type = 3, speed = 0.3) {
  if (!image) return;
  const { width, height } = size;
  const w = width / type;

  context.clearRect(0, 0, width, height);
  for (let i = 0; i < type; i += 1) {
    drawImage(context, image, i % 2 === 1, w * i, 0, w, height, time, speed);
  }
}

export function fade(context, size, opacity) {
  const { width, height } = size;
  context.fillStyle = `rgba(0,0,0,${opacity})`;
  context.fillRect(0, 0, width, height);
}

export default draw;
