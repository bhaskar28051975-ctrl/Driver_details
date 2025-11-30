// script.js — QR REMOVED VERSION

const canvas = document.getElementById('bannerCanvas');
const ctx = canvas.getContext('2d');

const driverFile = document.getElementById('driverFile');
const titleInput = document.getElementById('titleInput');
const taxiInput = document.getElementById('taxiInput');
const standInput = document.getElementById('standInput');
const licenseInput = document.getElementById('licenseInput');

const renderBtn = document.getElementById('renderBtn');
const downloadBtn = document.getElementById('downloadBtn');

let driverImg = new Image();
driverImg.src = "";

// Placeholder driver image
const placeholderDriver = (() => {
  const c = document.createElement("canvas");
  c.width = 800; c.height = 800;
  const g = c.getContext("2d");
  g.fillStyle = "#222"; g.fillRect(0,0,c.width,c.height);
  g.fillStyle = "#ffd36b";
  g.fillRect(0,0,c.width,c.height*0.45);
  g.fillStyle = "white";
  g.font = "bold 96px sans-serif";
  g.textAlign = "center";
  g.fillText("Driver", c.width/2, c.height/2 + 30);
  return c.toDataURL();
})();
driverImg.src = placeholderDriver;

// Load driver photo
driverFile.addEventListener("change", e => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {
    driverImg = new Image();
    driverImg.onload = drawBanner;
    driverImg.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

function drawBanner() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  const W = canvas.width;
  const H = canvas.height;

  // Left area width
  const leftWidth = Math.floor(W * 0.40);

  // Yellow background
  ctx.fillStyle = "#f3b017";
  ctx.fillRect(0,0,W,H);

  // Draw driver image
  const pad = 28;
  const imgW = leftWidth - pad*2;
  const imgH = H - pad*2;

  let dw = imgW;
  let dh = imgH;

  const aspect = driverImg.width / driverImg.height;

  if (aspect > 1) {
    dh = Math.min(imgH, Math.round(imgW / aspect));
  } else {
    dw = Math.min(imgW, Math.round(imgH * aspect));
  }

  const dx = pad + Math.floor((imgW - dw) / 2);
  const dy = pad + Math.floor((imgH - dh) / 2);

  ctx.drawImage(driverImg, dx, dy, dw, dh);

  // Text Section
  const title = titleInput.value;
  const taxi = taxiInput.value;
  const stand = standInput.value;
  const license = licenseInput.value;

  let textX = leftWidth + 40;
  let textY = 120;

  // Title
  ctx.fillStyle = "#111";
  ctx.font = "bold 72px sans-serif";
  ctx.fillText(title, textX, textY);
  textY += 90;

  // Taxi Number
  ctx.font = "bold 54px sans-serif";
  ctx.fillText("Taxi: " + taxi, textX, textY);
  textY += 70;

  // Stand
  ctx.font = "bold 42px sans-serif";
  ctx.fillText("Stand: " + stand, textX, textY);
  textY += 60;

  // License Number
  ctx.font = "bold 42px sans-serif";
  ctx.fillText("License: " + license, textX, textY);

  // Black bottom band
  ctx.fillStyle = "#111";
  ctx.fillRect(0, H - 72, W, 72);

  ctx.fillStyle = "#f3b017";
  ctx.font = "bold 44px sans-serif";
  ctx.fillText("TAXI", 110, H - 58);
}

renderBtn.addEventListener("click", drawBanner);

// Download PNG
downloadBtn.addEventListener("click", () => {
  drawBanner();
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = "sreekantha-banner.png";
  a.click();
});

// Auto draw
window.onload = drawBanner;
