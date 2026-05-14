const infoIcon = document.getElementById("info-icon");

const infoTooltip = document.getElementById("info-tooltip");

function showInfoTooltip() {
  infoTooltip.classList.add("visible");
}

function hideInfoTooltip() {
  infoTooltip.classList.remove("visible");
}

infoIcon.addEventListener("mouseenter", showInfoTooltip);

infoIcon.addEventListener("focus", showInfoTooltip);

infoIcon.addEventListener("mouseleave", hideInfoTooltip);

infoIcon.addEventListener("blur", hideInfoTooltip);
