const canvas = document.getElementById('bannerCanvas');
const ctx = canvas.getContext('2d');

const driverFileInput = document.getElementById('driverFile');
const titleInput = document.getElementById('titleInput');
const taxiInput = document.getElementById('taxiInput');
const standInput = document.getElementById('standInput');
const licenseInput = document.getElementById('licenseInput');

const renderBtn = document.getElementById('renderBtn');
const downloadBtn = document.getElementById('downloadBtn');

// MAIN RENDER FUNCTION
function renderBanner() {

  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw LEFT photo box (fixed size)
  const photoX = 40;
  const photoY = 80;
  const photoW = 360;
  const photoH = 360;

  // Draw placeholder border
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 3;
  ctx.strokeRect(photoX, photoY, photoW, photoH);

  // Load and draw driver photo
  const driverFile = driverFileInput.files[0];
  if (driverFile) {
    const img = new Image();
    img.onload = function () {
      ctx.drawImage(img, photoX, photoY, photoW, photoH);
    };
    img.src = URL.createObjectURL(driverFile);
  }

  // TEXT START POSITION
  const textX = 450;
  let tY = 100;

  ctx.fillStyle = "#000";
  ctx.textBaseline = "top";

  // TITLE (bigger)
  ctx.font = "bold 40px Arial";
  ctx.fillText(titleInput.value, textX, tY);
  tY += 80;

  // Smaller (26px) details
  ctx.font = "26px Arial";

  ctx.fillText("Taxi Number: " + taxiInput.value, textX, tY);
  tY += 60;

  ctx.fillText("Stand Name: " + standInput.value, textX, tY);
  tY += 60;

  ctx.fillText("License Number: " + licenseInput.value, textX, tY);
  tY += 60;
}

// Render button
renderBtn.addEventListener("click", renderBanner);

// Download image
downloadBtn.addEventListener("click", function () {
  const link = document.createElement("a");
  link.download = "banner.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
