window.startSketch = () => {
  if (bgSound && !isSoundPlaying) {
    if (bgSound.isLoaded()) {
      bgSound.setVolume(0);

      bgSound.play();

      isSoundPlaying = true;

      fadeInSound();
    } else {
      bgSound.onLoad(() => {
        bgSound.setVolume(0);

        bgSound.play();

        isSoundPlaying = true;

        fadeInSound();
      });
    }
  }
};

document.getElementById("intro-overlay").onclick = async () => {
  // 1. intro overlay 제거
  document.getElementById("intro-overlay").style.display = "none";

  // 2. 메인 인터페이스 표시
  document.getElementById("p5-container").style.display = "block";

  document.getElementById("weights-overlay").style.display = "block";

  document.getElementById("overlay-img").style.display = "block";


  const tooltip = document.getElementById("tooltip");

  tooltip.style.opacity = "0";
  tooltip.style.display = "none";

  document.getElementById("info-tooltip").classList.remove("visible");

  // 3. 검정 커버 표시
  const cover = document.getElementById("black-cover");

  cover.style.display = "block";

  // opacity transition 정상 작동용
  requestAnimationFrame(() => {
    cover.style.opacity = "1";
  });

  // 4. 사운드 재생
  try {
    if (typeof getAudioContext === "function") {
      await getAudioContext().resume();
    }

    if (typeof window.startSketch === "function") {
      window.startSketch();
    }
  } catch (err) {
    console.warn("소리 재생 오류:", err);
  }

  // 5. 검정 화면 fade out
  setTimeout(() => {
    cover.style.opacity = "0";

    setTimeout(() => {
      cover.style.display = "none";
    }, 1000);
  }, 2000);
};
