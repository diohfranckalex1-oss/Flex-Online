const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  table[i] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcVal = crc32(Buffer.concat([typeBuf, data]));
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPNG(width, height, getPixel) {
  const lineSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * lineSize);

  for (let y = 0; y < height; y++) {
    const lineOffset = y * lineSize;
    rawData[lineOffset] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = lineOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

// Pixel drawer for Flex Online Logo:
// Emerald-to-teal gradient background, crisp white 'F' with connected wave bars, and bright lime/emerald pulse dot.
function drawFlexIcon(x, y, width, height, isMaskable = false) {
  const nx = x / width;
  const ny = y / height;

  // Background gradient: top-left emerald (16, 185, 129) to bottom-right deep teal (4, 120, 87)
  const t = (nx + ny) / 2;
  const bgR = Math.round(16 * (1 - t) + 4 * t);
  const bgG = Math.round(185 * (1 - t) + 120 * t);
  const bgB = Math.round(129 * (1 - t) + 87 * t);

  // For non-maskable icons, apply rounded corners
  let cornerAlpha = 255;
  if (!isMaskable) {
    const radius = width * 0.22;
    let dist = 0;
    if (x < radius && y < radius) {
      dist = Math.hypot(x - radius, y - radius);
    } else if (x > width - radius && y < radius) {
      dist = Math.hypot(x - (width - radius), y - radius);
    } else if (x < radius && y > height - radius) {
      dist = Math.hypot(x - radius, y - (height - radius));
    } else if (x > width - radius && y > height - radius) {
      dist = Math.hypot(x - (width - radius), y - (height - radius));
    }
    if (dist > radius) {
      if (dist > radius + 1) return [0, 0, 0, 0];
      cornerAlpha = Math.round((1 - (dist - radius)) * 255);
    }
  }

  // Scale factor based on maskable safe zone (80% inside)
  const scale = isMaskable ? 0.72 : 0.82;
  const cx = width / 2;
  const cy = height / 2;

  // Coordinate relative to center, normalized to [-1, 1]
  const rx = (x - cx) / (cx * scale);
  const ry = (y - cy) / (cy * scale);

  // Draw 'F' letter and wave glyph
  // Vertical stem: rx from -0.55 to -0.28, ry from -0.55 to 0.55
  const inStem = (rx >= -0.55 && rx <= -0.28 && ry >= -0.55 && ry <= 0.55);
  // Top bar: rx from -0.55 to 0.42, ry from -0.55 to -0.32
  const inTopBar = (rx >= -0.55 && rx <= 0.42 && ry >= -0.55 && ry <= -0.32);
  // Mid bar: rx from -0.55 to 0.20, ry from -0.12 to 0.11
  const inMidBar = (rx >= -0.55 && rx <= 0.20 && ry >= -0.12 && ry <= 0.11);

  // Pulse dot at bottom right (rx ~ 0.38, ry ~ 0.38, radius ~ 0.16)
  const dotDist = Math.hypot(rx - 0.38, ry - 0.36);
  const inDot = (dotDist <= 0.16);
  const inDotRing = (dotDist > 0.16 && dotDist <= 0.24);

  if (inStem || inTopBar || inMidBar) {
    return [255, 255, 255, cornerAlpha];
  }

  if (inDot) {
    // Bright lime/mint online indicator: rgb(52, 211, 153)
    return [52, 211, 153, cornerAlpha];
  }

  if (inDotRing) {
    // Subtle glow ring: 50% opacity
    const alpha = Math.round((1 - (dotDist - 0.16) / 0.08) * 120);
    return [52, 211, 153, Math.min(alpha, cornerAlpha)];
  }

  return [bgR, bgG, bgB, cornerAlpha];
}

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Generate 192x192 PNG
const png192 = createPNG(192, 192, (x, y, w, h) => drawFlexIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);
console.log('✓ Created pwa-192x192.png');

// 2. Generate 512x512 PNG
const png512 = createPNG(512, 512, (x, y, w, h) => drawFlexIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);
console.log('✓ Created pwa-512x512.png');

// 3. Generate maskable 512x512 PNG (with safe-zone background bleed)
const pngMaskable = createPNG(512, 512, (x, y, w, h) => drawFlexIcon(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pngMaskable);
console.log('✓ Created pwa-maskable-512x512.png');

// 4. Generate apple-touch-icon.png (180x180)
const pngApple = createPNG(180, 180, (x, y, w, h) => drawFlexIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pngApple);
console.log('✓ Created apple-touch-icon.png');

// 5. Generate public/icon.svg
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="flexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#flexGrad)" />
  <path d="M140 130 h210 c14 0 24 10 24 24 v20 c0 14 -10 24 -24 24 H210 v70 h120 c14 0 24 10 24 24 v20 c0 14 -10 24 -24 24 H210 v110 c0 14 -10 24 -24 24 h-22 c-14 0 -24 -10 -24 -24 V154 c0 -14 10 -24 24 -24 z" fill="#ffffff" />
  <circle cx="390" cy="380" r="44" fill="#34d399" stroke="#065f46" stroke-width="12" />
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
console.log('✓ Created icon.svg');
