const video = document.getElementById("surprise-video");
const videoArea = document.getElementById("video-area");
const missingVideo = document.getElementById("missing-video");
const uploadButton = document.getElementById("upload-button");
const uploadInput = document.getElementById("video-upload");
const videoMute = document.getElementById("video-mute");
const videoVolume = document.getElementById("video-volume");
const videoFullscreen = document.getElementById("video-fullscreen");

const candidates = [
  "video/surprise.mp4",
  "video/surprise.webm",
  "video/surprise.ogv",
  "video/surprise.mov",
  "assets/video/surprise.mp4",
  "assets/videos/surprise.mp4"
];
let currentCandidateIndex = 0;
let savedVolume = 1;

const surpriseMusic = new Audio("assets/music/music4.mp3");
surpriseMusic.preload = "auto";
surpriseMusic.loop = true;
surpriseMusic.volume = 0.45;

async function playSurpriseMusic() {
  try {
    await surpriseMusic.play();
  } catch (error) {
    console.warn("music4.mp3 could not start:", error);
  }
}

function pauseSurpriseMusic() {
  surpriseMusic.pause();
}

function resetSurpriseMusic() {
  surpriseMusic.pause();
  surpriseMusic.currentTime = 0;
}

video.muted = false;
video.defaultMuted = false;
video.volume = 1;
videoVolume.value = "1";

function createHearts() {
  const container = document.querySelector(".floating-hearts");
  for (let i = 0; i < 24; i += 1) {
    const heart = document.createElement("span");
    heart.textContent = Math.random() > 0.2 ? "❤" : "✨";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${8 + Math.random() * 9}s`;
    heart.style.animationDelay = `${Math.random() * -12}s`;
    heart.style.fontSize = `${12 + Math.random() * 18}px`;
    container.appendChild(heart);
  }
}

async function fileExists(path) {
  try {
    const response = await fetch(path, { method: "HEAD", cache: "no-store" });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function sourceHasAudio(path) {
  try {
    const response = await fetch(path, { headers: { Range: "bytes=0-4194303" }, cache: "no-store" });
    if (!response.ok && response.status !== 206) return true;
    const bytes = new Uint8Array(await response.arrayBuffer());
    const audioMarkers = ["mp4a", "aac ", "ec-3", "ac-3", "opus", "vorb", "sound", "wvpk"];
    const text = new TextDecoder("latin1").decode(bytes);
    return audioMarkers.some((marker) => text.toLowerCase().includes(marker));
  } catch (error) {
    return true;
  }
}

async function playAutomatically() {
  if (!video.volume || video.volume === 0) video.volume = savedVolume || 1;

  video.muted = false;
  video.defaultMuted = false;
  try {
    await video.play();
    return true;
  } catch (error) {
    video.muted = true;
    video.defaultMuted = true;
    try {
      await video.play();
      return true;
    } catch (mutedError) {
      return false;
    }
  }
}

function enableVideoSound() {
  video.muted = false;
  video.defaultMuted = false;
  if (!video.volume || video.volume === 0) video.volume = savedVolume || 1;
  updateMuteControl();
  if (video.paused) video.play().catch(() => {});
  if (!video.paused) playSurpriseMusic();
}

async function tryPlaySource(path, candidateIndex = 0) {
  currentCandidateIndex = candidateIndex;
  const exists = await fileExists(path);
  if (!exists) {
    if (candidateIndex + 1 < candidates.length) {
      await tryPlaySource(candidates[candidateIndex + 1], candidateIndex + 1);
      return;
    }
    showMissingVideo();
    return;
  }

  videoArea.hidden = false;
  missingVideo.hidden = true;
  video.muted = true;
  video.defaultMuted = true;
  video.src = path;
  video.load();

  const hasAudio = await sourceHasAudio(path);
  if (!hasAudio && /\.mp4|\.m4v|\.mov/i.test(path)) {
    console.warn("The surprise video appears to have no readable audio track: " + path);
  }

  playAutomatically();
}

function showMissingVideo() {
  videoArea.hidden = true;
  missingVideo.hidden = false;
}

uploadButton.addEventListener("click", () => uploadInput.click());

uploadInput.addEventListener("change", () => {
  const file = uploadInput.files?.[0];
  if (!file) return;

  if (video.src.startsWith("blob:")) URL.revokeObjectURL(video.src);
  const objectUrl = URL.createObjectURL(file);
  videoArea.hidden = false;
  missingVideo.hidden = true;
  video.muted = false;
  video.defaultMuted = false;
  video.volume = savedVolume || 1;
  video.muted = true;
  video.defaultMuted = true;
  video.src = objectUrl;
  video.load();
  playAutomatically();
});

video.addEventListener("click", (event) => event.preventDefault());
video.addEventListener("contextmenu", (event) => event.preventDefault());

document.addEventListener("pointerdown", enableVideoSound, { once: true });
document.addEventListener("keydown", enableVideoSound, { once: true });

videoMute.addEventListener("click", () => {
  if (video.muted || video.volume === 0) {
    video.muted = false;
    video.volume = savedVolume || 1;
    videoVolume.value = String(video.volume);
  } else {
    if (video.volume > 0) savedVolume = video.volume;
    video.muted = true;
  }
  updateMuteControl();
});

videoVolume.addEventListener("input", () => {
  const newVolume = Number(videoVolume.value);
  video.volume = newVolume;
  video.muted = newVolume === 0;
  if (newVolume > 0) savedVolume = newVolume;
  updateMuteControl();
});

function updateMuteControl() {
  videoMute.textContent = video.muted || video.volume === 0 ? "🔇" : "🔊";
  videoMute.setAttribute("aria-label", video.muted || video.volume === 0 ? "Unmute video" : "Mute video");
}

videoFullscreen.addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (video.requestFullscreen) await video.requestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
  } catch (error) {
    console.warn("Fullscreen is not available for this browser.");
  }
});

video.addEventListener("play", () => {
  playSurpriseMusic();
});
video.addEventListener("pause", () => {
  pauseSurpriseMusic();
});
video.addEventListener("ended", () => {
  resetSurpriseMusic();
});
window.addEventListener("pagehide", resetSurpriseMusic);
video.addEventListener("volumechange", updateMuteControl);
video.addEventListener("error", () => {
  if (video.src.startsWith("blob:")) return;
  if (currentCandidateIndex + 1 < candidates.length) {
    tryPlaySource(candidates[currentCandidateIndex + 1], currentCandidateIndex + 1);
  } else {
    showMissingVideo();
  }
});

createHearts();
tryPlaySource(candidates[0], 0);
