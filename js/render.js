const infoIcon = document.getElementById("info-icon");
const infoTooltip = document.getElementById("info-tooltip");

function showTooltip() {
  infoTooltip.classList.add("visible");
}

function hideTooltip() {
  infoTooltip.classList.remove("visible");
}

infoIcon.addEventListener("mouseenter", showTooltip);
infoIcon.addEventListener("focus", showTooltip);
infoIcon.addEventListener("mouseleave", hideTooltip);
infoIcon.addEventListener("blur", hideTooltip);
