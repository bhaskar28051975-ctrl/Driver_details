const canvas = document.getElementById('bannerCanvas');
const ctx = canvas.getContext('2d');

const driverFileInput = document.getElementById('driverFile');
const titleInput = document.getElementById('titleInput');
const taxiInput = document.getElementById('taxiInput');
const standInput = document.getElementById('standInput');
const licenseInput = document.getElementById('licenseInput');

const renderBtn = document.getElementById('renderBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Function to render banner
function renderBanner() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Optional: Background color
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set common font style
  ctx.fillStyle = '#000';
  ctx.font = '26px Arial'; // <-- Font size for all text
  ctx.textBaseline = 'top';

  // Draw Title
  ctx.fillText(titleInput.value, 200, 50); // x=200, y=50

  // Draw Taxi Number
  ctx.fillText(`Taxi Number: ${taxiInput.value}`, 200, 120);

  // Draw Stand Name
  ctx.fillText(`Stand: ${standInput.value}`, 200, 190);

  // Draw License Number
  ctx.fillText(`License: ${licenseInput.value}`, 200, 260);

  // Draw Driver Photo if uploaded
  const driverFile = driverFileInput.files[0];
  if (driverFile) {
    const img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 20, 50, 150, 150); // x, y, width, height
    };
    img.src = URL.createObjectURL(driverFile);
  }
}

// Render button click
renderBtn.addEventListener('click', renderBanner);

// Download banner as PNG
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'banner.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
