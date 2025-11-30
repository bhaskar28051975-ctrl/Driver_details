// script.js
// Draws the banner to canvas (1280x720), allows driver image upload and QR generation.
// Uses Google Chart API to generate QR image: https://chart.googleapis.com/chart?chs=SIZExSIZE&cht=qr&chl=DATA

const canvas = document.getElementById('bannerCanvas');
const ctx = canvas.getContext('2d');

const driverFile = document.getElementById('driverFile');
const titleInput = document.getElementById('titleInput');
const taxiInput = document.getElementById('taxiInput');
const qrInput = document.getElementById('qrInput');
const renderBtn = document.getElementById('renderBtn');
const downloadBtn = document.getElementById('downloadBtn');

let driverImg = new Image();
driverImg.crossOrigin = "anonymous"; // allow cross-origin when possible
driverImg.src = ''; // default blank

// default placeholder driver image (simple colored placeholder generated as data URL)
const placeholderDriver = (function(){
  const c = document.createElement('canvas');
  c.width = 800; c.height = 800;
  const g = c.getContext('2d');
  g.fillStyle = '#222'; g.fillRect(0,0,c.width,c.height);
  g.fillStyle = '#ffd36b';
  g.fillRect(0,0, c.width, c.height*0.45);
  g.fillStyle = 'white';
  g.font = 'bold 96px sans-serif';
  g.textAlign = 'center';
  g.fillText('Driver', c.width/2, c.height/2 + 30);
  return c.toDataURL('image/png');
})();
driverImg.src = placeholderDriver;

driverFile.addEventListener('change', e => {
  const f = e.target.files && e.target.files[0];
  if(!f) return;
  const reader = new FileReader();
  reader.onload = ev => {
    driverImg = new Image();
    driverImg.onload = () => {
      drawBanner(); // re-draw after image load
    };
    driverImg.src = ev.target.result;
  };
  reader.readAsDataURL(f);
});

function drawBanner(){
  // Clear
  ctx.clearRect(0,0,canvas.width, canvas.height);

  // Layout constants
  const W = canvas.width;   // 1280
  const H = canvas.height;  // 720
  const leftWidth = Math.floor(W * 0.40); // left driver area ~40%
  const rightWidth = W - leftWidth;

  // Background color (brand yellow)
  ctx.fillStyle = '#f3b017'; // yellow
  ctx.fillRect(0,0,W,H);

  // Left driver area: fill with slightly darker strip or keep same color
  // Draw driver image in left area, centered vertically, with some padding
  const pad = 28;
  const imgAreaW = leftWidth - pad*2;
  const imgAreaH = H - pad*2;

  // compute driver image size while preserving aspect ratio
  let dw = imgAreaW;
  let dh = imgAreaH;
  const ratio = driverImg.width / Math.max(1, driverImg.height);
  if(driverImg.width > driverImg.height){
    // landscape driver image
    dh = Math.min(imgAreaH, Math.round(imgAreaW / ratio));
  } else {
    dw = Math.min(imgAreaW, Math.round(imgAreaH * ratio));
  }

  // position to center within left area
  const dx = pad + Math.floor((imgAreaW - dw)/2);
  const dy = pad + Math.floor((imgAreaH - dh)/2);

  // draw rounded clipped image (rounded rectangle)
  roundImage(driverImg, dx, dy, dw, dh, 20);

  // Right side texts
  const title = titleInput.value || 'Sree Kantha Tour and Travel';
  const taxi = taxiInput.value || 'AP 04 T5621';

  // Text styling
  // We'll set big title with line wrap as needed
  ctx.fillStyle = '#111';
  // Draw title in bold, large
  const titleX = leftWidth + 40;
  let titleY = 120;
  ctx.textBaseline = 'top';

  // Big headline: we'll split into up to 3 lines to fit
  const maxLineWidth = rightWidth - 80;
  ctx.font = 'bold 72px "Segoe UI", Roboto, Arial, sans-serif';
  const lines = wrapText(ctx, title, maxLineWidth);
  for(let i=0;i<lines.length && i<3;i++){
    ctx.fillText(lines[i], titleX, titleY);
    titleY += 78; // line height
  }

  // Taxi number below
  ctx.font = 'bold 54px "Segoe UI", Roboto, Arial, sans-serif';
  ctx.fillText(taxi, titleX, titleY + 14);

  // Draw QR image in bottom-right with white rounded box
  const qrSize = 220;
  const qrPadding = 18;
  const qrBoxW = qrSize + qrPadding*2;
  const qrBoxH = qrSize + qrPadding*2;
  const qrBoxX = W - qrBoxW - 36;
  const qrBoxY = H - qrBoxH - 36;

  // white rounded rectangle as background
  roundRect(ctx, qrBoxX, qrBoxY, qrBoxW, qrBoxH, 18, '#fff');

  // fetch qr image
  const qrData = qrInput.value || '';
  const qrUrl = makeGoogleQRUrl(qrData, qrSize);

  // Draw QR image (loads async). To avoid flash we draw outline, then load and draw actual image.
  const qrImg = new Image();
  qrImg.crossOrigin = 'anonymous';
  qrImg.onload = () => {
    ctx.drawImage(qrImg, qrBoxX + qrPadding, qrBoxY + qrPadding, qrSize, qrSize);
  };
  qrImg.onerror = () => {
    // if QR fetch fails, show a fallback small text
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText('QR unavailable', qrBoxX + 16, qrBoxY + qrBoxH/2 - 6);
  };
  qrImg.src = qrUrl;

  // bottom band (optional) — small black taxi strip with icon and word TAXI
  const bandH = 72;
  ctx.fillStyle = '#111';
  ctx.fillRect(0, H - bandH, W, bandH);
  // taxi icon (very simple) and text
  ctx.fillStyle = '#f3b017';
  // small car rect as icon approximation
  ctx.fillRect(28, H - bandH + 12, 56, 36);
  ctx.fillStyle = '#f3b017';
  ctx.font = 'bold 44px "Segoe UI", Roboto, Arial, sans-serif';
  ctx.fillText('TAXI', 110, H - bandH + 14);

  // done
}

// helper: draw image clipped to rounded rectangle
function roundImage(img, x, y, w, h, r){
  const ctx = canvas.getContext('2d');
  ctx.save();
  roundRectPath(ctx, x, y, w, h, r);
  ctx.clip();
  // fill with a subtle background before draw to avoid transparent edges
  ctx.fillStyle = '#333';
  ctx.fillRect(x,y,w,h);
  // draw image centered & cover
  const srcAspect = img.width / img.height;
  const destAspect = w / h;
  let sx=0, sy=0, sw=img.width, sh=img.height;
  if(srcAspect > destAspect){
    // source wider -> crop sides
    sw = Math.round(img.height * destAspect);
    sx = Math.round((img.width - sw)/2);
  } else {
    // source taller -> crop top/bottom
    sh = Math.round(img.width / destAspect);
    sy = Math.round((img.height - sh)/2);
  }
  try {
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  } catch(err){
    // if draw fails (rare), fallback to fill color
    ctx.fillStyle = '#222';
    ctx.fillRect(x,y,w,h);
  }
  ctx.restore();
}

function roundRectPath(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function roundRect(ctx, x, y, w, h, r, fillStyle){
  ctx.save();
  roundRectPath(ctx, x, y, w, h, r);
  ctx.fillStyle = fillStyle || '#fff';
  ctx.fill();
  ctx.restore();
}

// small text wrapping helper
function wrapText(ctx, text, maxWidth){
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for(const w of words){
    const test = cur ? cur + ' ' + w : w;
    const m = ctx.measureText(test).width;
    if(m <= maxWidth){
      cur = test;
    } else {
      if(cur) lines.push(cur);
      cur = w;
    }
  }
  if(cur) lines.push(cur);
  return lines;
}

// generate google chart qr image url
function makeGoogleQRUrl(data, size){
  if(!data) data = '';
  // encode data; specify error correction L and margin (chs handles size)
  const base = 'https://chart.googleapis.com/chart';
  const params = new URLSearchParams({
    chs: `${size}x${size}`,
    cht: 'qr',
    chl: data,
    chld: 'L|1' // error correction L, margin 1
  });
  return base + '?' + params.toString();
}

renderBtn.addEventListener('click', () => {
  drawBanner();
});

// download the current canvas as PNG
downloadBtn.addEventListener('click', () => {
  // ensure the latest render (synchronously) — QR image may still be loading; we'll redraw then wait short.
  drawBanner();
  // small delay to allow QR image to draw
  setTimeout(() => {
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sreekantha-banner.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, 350); // 350ms is typically enough to fetch QR image from Google; increase if slow.
});

// initial draw
window.addEventListener('load', () => {
  drawBanner();
});
