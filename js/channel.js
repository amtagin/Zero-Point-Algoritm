let currentChannel = 0;
const gifs = [
  "assets/뉴스화면1.gif",
  "assets/뉴스화면2.gif",
  "assets/뉴스화면3.gif",
  "assets/뉴스화면4.gif",
  "assets/뉴스화면5.gif",
  "assets/뉴스화면6.gif",
  "assets/뉴스화면7.gif",
  "assets/뉴스화면8.gif",
  "assets/뉴스화면9.gif",
];

const gifElement = document.getElementById("tv-gif");
const p5Container = document.getElementById("p5-container");

function updateChannel() {
  const overlayImg = document.getElementById("overlay-img");
  if (currentChannel === 0) {
    p5Container.style.display = "block";
    gifElement.style.display = "none";
    overlayImg.style.display = "block";
  } else {
    p5Container.style.display = "none";
    gifElement.style.display = "block";
    gifElement.src = gifs[currentChannel - 1];
    overlayImg.style.display = "none";
  }
}

document.getElementById("prev-btn").onclick = () => {
  currentChannel = currentChannel === 0 ? gifs.length : currentChannel - 1;
  updateChannel();
};

document.getElementById("next-btn").onclick = () => {
  currentChannel = currentChannel === gifs.length ? 0 : currentChannel + 1;
  updateChannel();
};

document.getElementById("default-btn").onclick = () => {
  currentChannel = 0;
  updateChannel();
  if (typeof resetSimulation === "function") {
    resetSimulation();
  }
};
