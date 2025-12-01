document.getElementById("renderBtn").addEventListener("click", function () {
  const driverFile = document.getElementById("driverFile").files[0];
  const title = document.getElementById("titleInput").value;
  const taxi = document.getElementById("taxiInput").value;
  const stand = document.getElementById("standInput").value;
  const license = document.getElementById("licenseInput").value;

  const canvas = document.getElementById("bannerCanvas");
  const ctx = canvas.getContext("2d");

  // Background color
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Load driver photo
  if (driverFile) {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 400, 720);

      drawText();
    };
    img.src = URL.createObjectURL(driverFile);
  } else {
    drawText();
  }

  function drawText() {
    // --------- BIG BOLD FONT FOR ALL TEXT ----------
    const FONT = "bold 48px Arial"; 
    ctx.font = FONT;
    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "top";

    // Text Positions
    ctx.fillText(title, 420, 60);
    ctx.fillText("Taxi No: " + taxi, 420, 160);
    ctx.fillText("Stand: " + stand, 420, 260);
    ctx.fillText("License: " + license, 420, 360);
  }
});

// Download PNG
document.getElementById("downloadBtn").addEventListener("click", function () {
  const canvas = document.getElementById("bannerCanvas");
  const link = document.createElement("a");
  link.download = "banner.png";
  link.href = canvas.toDataURL();
  link.click();
});
