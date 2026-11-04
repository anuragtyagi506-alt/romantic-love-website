const effects = document.querySelector(".memories-effects");
const lines = [...document.querySelectorAll(".memory-line")];
const forgiveButton = document.getElementById("forgive-me-button");
const popup = document.getElementById("forgive-popup");
const closePopup = document.getElementById("close-forgive-popup");
const popupOk = document.getElementById("popup-ok");
const memoriesMusic = document.getElementById("memories-music");
const memoriesPlaylist = [
  "assets/music/music2.mp3",
  "assets/music/music3.mp3"
];
let memoriesTrackIndex = 0;

memoriesMusic.volume = 0.45;

function loadAndPlayMemoryMusic() {
  if (!memoriesMusic.getAttribute("src")) {
    memoriesMusic.src = memoriesPlaylist[memoriesTrackIndex];
    memoriesMusic.load();
  }
  memoriesMusic.play().catch(() => {});
}

memoriesMusic.addEventListener("ended", () => {
  memoriesTrackIndex = (memoriesTrackIndex + 1) % memoriesPlaylist.length;
  memoriesMusic.src = memoriesPlaylist[memoriesTrackIndex];
  memoriesMusic.load();
  memoriesMusic.play().catch(() => {});
});

loadAndPlayMemoryMusic();
document.addEventListener("pointerdown", loadAndPlayMemoryMusic, { once: true });
document.addEventListener("keydown", loadAndPlayMemoryMusic, { once: true });

for (let i = 0; i < 28; i += 1) {
  const item = document.createElement("span");
  item.textContent = Math.random() > 0.35 ? "❤" : "🌹";
  item.style.left = `${Math.random() * 100}%`;
  item.style.animationDuration = `${8 + Math.random() * 9}s`;
  item.style.animationDelay = `${Math.random() * -16}s`;
  item.style.fontSize = `${10 + Math.random() * 16}px`;
  effects.appendChild(item);
}

lines.forEach((line, index) => {
  line.style.animationDelay = `${350 + index * 280}ms`;
});

function openPopup() {
  popup.hidden = false;
  document.body.classList.add("popup-open");
}

function closePopupWindow() {
  popup.hidden = true;
  document.body.classList.remove("popup-open");
}

forgiveButton.addEventListener("click", openPopup);
closePopup.addEventListener("click", closePopupWindow);
popupOk.addEventListener("click", closePopupWindow);
popup.addEventListener("click", (event) => {
  if (event.target === popup) closePopupWindow();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !popup.hidden) closePopupWindow();
});
