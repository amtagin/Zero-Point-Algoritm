// ────────────────────────────────────
// ⚖️ 저울·접시 전역 변수 선언부
// ────────────────────────────────────
let currentMaxAngle = 0.6;
let currentAngleVelMag = 0.02;
let angle = 0;
let angleVel = 0.02;
let maxAngle = 0.5;

let weightLeft = 0;
let weightRight = 0;
let damping = 0.99;
let addingWeightCount = 0;
let totalWeights = 9;

let weightImages = [];
let weights = [];
let weightElements = [];

let bgSound;
let isSoundPlaying = false;

let centerImage, rightPlateImage, scaleImage, leftPlateImage, center2Image;

let leftPlateAngle = 0;
let rightPlateAngle = 0;
let leftAngularVel = 0;
let rightAngularVel = 0;

let plateDamping = 0.98;
let plateK = 0.1;

let tooltipToggleLeft = true;

// ────────────────────────────────────
// 📂 이미지 로딩
// ────────────────────────────────────
function preload() {
  for (let i = 1; i <= totalWeights; i++) {
    weightImages.push(loadImage(`assets/${i}.png`));
  }

  scaleImage = loadImage("assets/저울.png");
  leftPlateImage = loadImage("assets/왼접시.png");
  rightPlateImage = loadImage("assets/오접시.png");
  centerImage = loadImage("assets/중심.png");
  center2Image = loadImage("assets/중심2.png");

  bgSound = loadSound("assets/seoul.mp3");
}

function setup() {
  const container = document.getElementById("p5-container");

  const w = container.clientWidth;
  const h = container.clientHeight;

  let canvas = createCanvas(w, h);

  canvas.parent("p5-container");

  angleMode(RADIANS);

  maxAngle = 0.5;

  leftPlateAngle = random(-0.05, 0.05);
  rightPlateAngle = random(-0.05, 0.05);

  setupWeights();
  setupWeightDOM();

  redraw();

  frameRate(60);

  if (typeof window.startSketch === "function") {
    window.startSketch();
  }
}

function setupWeights() {
  weights = [];

  for (let i = 0; i < totalWeights; i++) {
    weights.push({
      image: weightImages[i],
      used: false,
      assignedTo: null,
    });
  }
}

function setupWeightDOM() {
  weightElements = document.querySelectorAll(".weight");

  weightElements.forEach((el, i) => {
    el.style.backgroundImage = `url(assets/${i + 1}.png)`;

    el.addEventListener("click", () => {
      handleWeightClick(i);
    });

    el.addEventListener("mouseenter", () => {
      showTooltip(i);
    });

    el.addEventListener("mouseleave", hideTooltip);
  });
}

function handleWeightClick(index) {
  if (addingWeightCount >= 2) return;

  const w = weights[index];

  if (w.used) return;

  w.used = true;

  if (addingWeightCount === 0) {
    weightLeft++;
    w.assignedTo = "left";
  } else {
    weightRight++;
    w.assignedTo = "right";
  }

  weightElements[index].style.opacity = "0";
  weightElements[index].style.pointerEvents = "none";

  addingWeightCount++;

  if (addingWeightCount === 2 && bgSound?.isPlaying()) {
    fadeOutAndStopSound();
  }
}

function draw() {
  background(255);

  let baseX = width / 2;
  let baseY = height / 2 - 10;

  let scaleW = width * 0.55;
  let scaleRatio = scaleW / 400;

  let armLength = 190;
  let plateOffsetY = -60;
  let plateSize = 100;

  let usedCount = weights.filter((w) => w.used).length;

  let baseMaxAngle = 0.6;
  let baseAngleVel = 0.02;

  let t = Math.min(usedCount, 2) / 2;

  let targetMaxAngle = lerp(baseMaxAngle, 0, t);
  let targetAngleVelMag = lerp(baseAngleVel, 0, t);

  currentMaxAngle += (targetMaxAngle - currentMaxAngle) * 0.05;

  currentAngleVelMag += (targetAngleVelMag - currentAngleVelMag) * 0.05;

  let angleVelSign = angleVel >= 0 ? 1 : -1;

  angleVel = angleVelSign * currentAngleVelMag;

  angle += angleVel;

  if (angle > currentMaxAngle) {
    angle = currentMaxAngle;
    angleVel *= -1;
  } else if (angle < -currentMaxAngle) {
    angle = -currentMaxAngle;
    angleVel *= -1;
  }

  leftAngularVel += -plateK * sin(leftPlateAngle);
  leftAngularVel *= plateDamping;
  leftPlateAngle += leftAngularVel;

  rightAngularVel += -plateK * sin(rightPlateAngle);
  rightAngularVel *= plateDamping;
  rightPlateAngle += rightAngularVel;

  let plateW = plateSize;

  let plateHLeft = plateSize * (leftPlateImage.height / leftPlateImage.width);

  let plateHRight =
    plateSize * (rightPlateImage.height / rightPlateImage.width);

  imageMode(CENTER);

  push();

  translate(baseX, baseY);

  rotate(angle);

  scale(scaleRatio);

  let hingeOffsetLeft = plateHLeft / 2;
  let hingeOffsetRight = plateHRight / 2;

  // 왼쪽 접시
  push();

  translate(-armLength, plateOffsetY);

  rotate(leftPlateAngle - angle);

  for (let i = 0; i < weights.length; i++) {
    let w = weights[i];

    if (w.used && w.assignedTo === "left") {
      image(w.image, 0, hingeOffsetLeft + plateHLeft / 2 - 30, 30, 40);
    }
  }

  image(leftPlateImage, 0, hingeOffsetLeft, plateW, plateHLeft);

  pop();

  // 오른쪽 접시
  push();

  translate(armLength, plateOffsetY);

  rotate(rightPlateAngle - angle);

  for (let i = 0; i < weights.length; i++) {
    let w = weights[i];

    if (w.used && w.assignedTo === "right") {
      image(w.image, 0, hingeOffsetRight + plateHRight / 2 - 30, 30, 40);
    }
  }

  image(rightPlateImage, 0, hingeOffsetRight, plateW, plateHRight);

  pop();

  image(scaleImage, 0, -50, 460, 60);

  pop();

  drawPalette();

  let centerW = 200;

  let centerH = centerW * (centerImage.height / centerImage.width);

  image(
    centerImage,
    baseX,
    baseY + 110 * scaleRatio,
    centerW * scaleRatio,
    centerH * scaleRatio
  );
}

function playRandomStart() {
  if (bgSound && !isSoundPlaying) {
    let duration = bgSound.duration();

    if (isNaN(duration) || duration <= 0) {
      bgSound.onloadedmetadata = () => {
        let duration = bgSound.duration();

        let startTime = random(0, Math.max(0, duration - 10));

        bgSound.jump(startTime);

        bgSound.play();

        isSoundPlaying = true;
      };
    } else {
      let startTime = random(0, Math.max(0, duration - 10));

      bgSound.jump(startTime);

      bgSound.play();

      isSoundPlaying = true;
    }
  }
}

function mousePressed() {
  const canvasRect = document
    .getElementById("p5-container")
    .getBoundingClientRect();

  const screenX = canvasRect.left + mouseX;
  const screenY = canvasRect.top + mouseY;

  const clickedElement = document.elementFromPoint(screenX, screenY);

  if (
    clickedElement &&
    (clickedElement.closest("button") || clickedElement.closest(".weight"))
  ) {
    return;
  }
}

function showTooltip(i) {
  const tooltip = document.getElementById("tooltip");

  const tooltipWidth = 200;

  const centerX = window.innerWidth / 2;
  const monitorY = window.innerHeight / 2 - 80;

  const horizontalOffset = 400;

  const tooltipX = tooltipToggleLeft
    ? centerX - horizontalOffset - tooltipWidth / 2
    : centerX + horizontalOffset - tooltipWidth / 2;

  tooltip.innerHTML = `
    <img 
      src="assets/툴팁${i + 1}.png"
      style="width:${tooltipWidth}px; height:auto;"
    >
  `;

  tooltip.style.left = `${tooltipX}px`;
  tooltip.style.top = `${monitorY}px`;

  tooltip.style.opacity = "1";
  tooltip.style.display = "block";

  tooltipToggleLeft = !tooltipToggleLeft;
}

function hideTooltip() {
  const tooltip = document.getElementById("tooltip");

  tooltip.style.opacity = "0";
}

function resetSimulation() {
  weightLeft = 0;
  weightRight = 0;

  angle = 0;
  angleVel = 0.01;

  addingWeightCount = 0;

  leftPlateAngle = 0;
  rightPlateAngle = 0;

  leftAngularVel = 0;
  rightAngularVel = 0;

  for (let i = 0; i < weights.length; i++) {
    weights[i].used = false;
    weights[i].assignedTo = null;
  }

  weightElements.forEach((el) => {
    el.style.opacity = "1";
    el.style.pointerEvents = "auto";
  });

  if (bgSound) {
    bgSound.stop();

    bgSound.setVolume(1.0);

    isSoundPlaying = false;

    playRandomStart();
  }
}

function drawPalette() {
  // 필요 시 구현
}

function fadeOutAndStopSound(duration = 2000) {
  if (!bgSound || !bgSound.isPlaying()) return;

  let startVol = bgSound.getVolume();

  let steps = 30;

  let stepTime = duration / steps;

  let currentStep = 0;

  let fadeInterval = setInterval(() => {
    currentStep++;

    let vol = startVol * (1 - currentStep / steps);

    bgSound.setVolume(vol);

    if (currentStep >= steps) {
      clearInterval(fadeInterval);

      bgSound.stop();

      bgSound.setVolume(startVol);

      isSoundPlaying = false;
    }
  }, stepTime);
}

function fadeInSound(duration = 2000) {
  if (!bgSound) return;

  let steps = 30;

  let stepTime = duration / steps;

  let currentStep = 0;

  let fadeInterval = setInterval(() => {
    currentStep++;

    let vol = currentStep / steps;

    bgSound.setVolume(vol);

    if (currentStep >= steps) {
      clearInterval(fadeInterval);
    }
  }, stepTime);
}
