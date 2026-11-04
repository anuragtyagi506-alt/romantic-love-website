const config = {
  // Update this to the exact date we first met (YYYY-MM-DD format).
  // Exact password format shown in the input: DD/MM/YYYY.
  firstMeetingDate: "12/02/2024",
  // If you replace the photo later, keep it in assets/images and update the filename here.
  photoPath: "assets/images/girlfriend-photo.jpg",
  // Songs play one after another when they finish.
  musicPlaylist: [
    { title: "Gujarish", path: "assets/music/music1.mp3" },
    { title: "Our Special Song", path: "assets/music/music2.mp3" },
    { title: "Our Special Song 2", path: "assets/music/music3.mp3" },
  ],
};

let currentTrackIndex = 0;

const loginScreen = document.getElementById("login-screen");
const mainPage = document.getElementById("main-page");
const loader = document.getElementById("loader");
const loginForm = document.getElementById("login-form");
const passwordInput = document.getElementById("password-input");
const loginError = document.getElementById("login-error");
const bgMusic = document.getElementById("bg-music");
const surpriseMessage = document.getElementById("surprise-message");
const forgiveBtn = document.getElementById("forgive-btn");
const timeBtn = document.getElementById("time-btn");
const surpriseBtn = document.getElementById("surprise-btn");
const surpriseModal = document.getElementById("surprise-modal");
const surpriseVideo = document.getElementById("surprise-video");
const surpriseVideoPlay = document.getElementById("surprise-video-play");
const surpriseVideoError = document.getElementById("surprise-video-error");
const surpriseClose = document.getElementById("surprise-close");
const surpriseSlide = document.getElementById("surprise-slide");
const slidePrev = document.getElementById("slide-prev");
const slideNext = document.getElementById("slide-next");
const slidePlay = document.getElementById("slide-play");
const slideCounter = document.getElementById("slide-counter");
const slideProgress = document.getElementById("slide-progress");
const envelope = document.querySelector(".envelope");
const typewriter = document.querySelector(".typewriter");

const backgroundHearts = document.querySelector(".bg-hearts");
const petalsContainer = document.querySelector(".rose-petals");
const sparklesContainer = document.querySelector(".sparkles");

const unlockKey = "love-site-unlocked";
let surpriseMusicPaused = false;

function createFloatingBackground() {
  const heartCount = 18;
  for (let i = 0; i < heartCount; i += 1) {
    const heart = document.createElement("span");
    heart.textContent = "❤";
    heart.style.position = "absolute";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.top = `${Math.random() * 100}%`;
    heart.style.fontSize = `${Math.random() * 1.8 + 0.8}rem`;
    heart.style.opacity = String(Math.random() * 0.5 + 0.25);
    heart.style.animation = `floatUp ${Math.random() * 11 + 10}s linear infinite`;
    heart.style.animationDelay = `${Math.random() * 6}s`;
    backgroundHearts.appendChild(heart);
  }

  const petalCount = 18;
  for (let i = 0; i < petalCount; i += 1) {
    const petal = document.createElement("span");
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${Math.random() * 10 + 12}s`;
    petal.style.animationDelay = `${Math.random() * 6}s`;
    petal.style.setProperty("--petal-drift", `${Math.random() * 200 - 100}px`);
    petalsContainer.appendChild(petal);
  }

  const sparkleCount = 48;
  for (let i = 0; i < sparkleCount; i += 1) {
    const sparkle = document.createElement("span");
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.animationDelay = `${Math.random() * 3}s`;
    sparkle.style.animationDuration = `${Math.random() * 3 + 2}s`;
    sparklesContainer.appendChild(sparkle);
  }
}

async function resumeMusic() {
  if (!bgMusic || surpriseMusicPaused) return;
  if (!bgMusic.paused) return;

  try {
    await bgMusic.play();
  } catch (error) {
    console.warn("Browser blocked automatic audio until a page gesture:", error);
  }
}

function showError(message) {
  loginError.textContent = message;
  loginError.classList.add("visible");
  passwordInput.classList.add("shake");
  setTimeout(() => passwordInput.classList.remove("shake"), 420);
}

function triggerSuccessBurst() {
  const burst = document.createElement("div");
  burst.className = "login-success-burst";

  for (let i = 0; i < 28; i += 1) {
    const heart = document.createElement("span");
    heart.className = "burst-heart";
    heart.textContent = "❤";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.top = `${Math.random() * 100}%`;
    heart.style.animationDelay = `${Math.random() * 0.25}s`;
    heart.style.transform = `translate(-50%, -50%) scale(${Math.random() * 0.8 + 0.7})`;
    burst.appendChild(heart);
  }

  loginScreen.appendChild(burst);
  setTimeout(() => burst.remove(), 1800);
}

function showMainPage() {
  document.body.classList.remove("login-active");
  loginScreen.classList.add("hidden");
  mainPage.classList.add("visible");
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 700);
}

function typeText(node, text) {
  if (!node) return;

  let index = 0;
  node.textContent = "";

  const tick = () => {
    node.textContent = text.slice(0, index);
    index += 1;

    if (index <= text.length) {
      setTimeout(tick, 38);
    }
  };

  tick();
}

function createCelebrationBurst() {
  const burst = document.createElement("div");
  burst.className = "celebration-burst";

  for (let i = 0; i < 40; i += 1) {
    const heart = document.createElement("span");
    heart.className = "burst-heart";
    heart.textContent = "❤";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.top = `${Math.random() * 100}%`;
    heart.style.animationDelay = `${Math.random() * 0.4}s`;
    heart.style.setProperty("--drift", `${Math.random() * 160 - 80}px`);
    burst.appendChild(heart);
  }

  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 2000);
}

function handlePasswordSubmit(event) {
  event.preventDefault();
  const enteredDate = passwordInput.value.trim();

  if (enteredDate === config.firstMeetingDate) {
    loginError.textContent = "";
    loginError.classList.remove("visible");
    localStorage.setItem(unlockKey, "true");
    triggerSuccessBurst();
    resumeMusic();

    setTimeout(() => {
      showMainPage();
    }, 900);

    setTimeout(() => {
      passwordInput.value = "";
    }, 1200);

    return;
  }

  showError("Oops! That date is not the one we shared. Try again 💔");
}

function setupDateMask() {
  if (!passwordInput) return;

  passwordInput.addEventListener("input", () => {
    let digits = passwordInput.value.replace(/\D/g, "").slice(0, 8);

    if (digits.length > 4) {
      digits = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
      digits = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    passwordInput.value = digits;
  });
}

function initializeMusic() {
  if (!bgMusic) return;

  bgMusic.loop = false;
  bgMusic.volume = 0.45;
  bgMusic.src = config.musicPlaylist[currentTrackIndex].path;
  bgMusic.load();

  async function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % config.musicPlaylist.length;
    bgMusic.src = config.musicPlaylist[currentTrackIndex].path;
    bgMusic.load();

    try {
      await bgMusic.play();
    } catch (error) {
      console.warn("Browser requires a gesture before the next song can play:", error);
    }
  }

  bgMusic.addEventListener("ended", playNextTrack);

  // Attempt autoplay once after the requested 3-second delay.
  setTimeout(() => {
    resumeMusic();
  }, 3000);

  // Browsers that block sound without a gesture will unlock it on the first page interaction.
  document.addEventListener("pointerdown", resumeMusic, { once: true });
  document.addEventListener("keydown", resumeMusic, { once: true });
}

function setupEnvelope() {
  if (!envelope) return;

  envelope.addEventListener("click", () => {
    const isOpen = envelope.classList.toggle("open");
    envelope.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

function setupSurpriseButtons() {
  if (!forgiveBtn || !timeBtn) return;

  forgiveBtn.addEventListener("click", () => {
    surpriseMessage.innerHTML = "<span>Thank you for giving me another chance, My Love! ❤️</span>";
    if (surpriseBtn) surpriseBtn.hidden = false;
    createCelebrationBurst();
  });

  timeBtn.addEventListener("click", () => {
    surpriseMessage.innerHTML =
      "<span>It's okay, take your time. Your happiness and feelings matter to me. ❤️</span>";
  });

  let timeButtonReturnTimer = null;
  let lastTimeButtonDodge = 0;

  const resetTimeButton = () => {
    clearTimeout(timeButtonReturnTimer);
    lastTimeButtonDodge = 0;
    timeBtn.classList.remove("is-dodging");
    timeBtn.style.left = "";
    timeBtn.style.top = "";
    timeBtn.style.width = "";
  };

  const dodgeTimeButton = () => {
    clearTimeout(timeButtonReturnTimer);
    const now = Date.now();
    if (now - lastTimeButtonDodge < 280) return;
    lastTimeButtonDodge = now;
    const rect = timeBtn.getBoundingClientRect();
    if (!timeBtn.classList.contains("is-dodging")) {
      timeBtn.style.width = `${rect.width}px`;
      timeBtn.classList.add("is-dodging");
      timeBtn.style.left = `${rect.left}px`;
      timeBtn.style.top = `${rect.top}px`;
    }

    const padding = 12;
    const maxLeft = Math.max(padding, window.innerWidth - rect.width - padding);
    const maxTop = Math.max(padding, window.innerHeight - rect.height - padding);
    const left = padding + Math.random() * Math.max(0, maxLeft - padding);
    const top = padding + Math.random() * Math.max(0, maxTop - padding);

    timeBtn.style.left = `${Math.round(left)}px`;
    timeBtn.style.top = `${Math.round(top)}px`;
  };

  timeBtn.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "touch") dodgeTimeButton();
  });

  timeBtn.addEventListener("mouseleave", resetTimeButton);
  timeBtn.addEventListener("pointercancel", resetTimeButton);

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    const rect = timeBtn.getBoundingClientRect();
    const distanceX = event.clientX < rect.left
      ? rect.left - event.clientX
      : event.clientX > rect.right ? event.clientX - rect.right : 0;
    const distanceY = event.clientY < rect.top
      ? rect.top - event.clientY
      : event.clientY > rect.bottom ? event.clientY - rect.bottom : 0;
    if (Math.hypot(distanceX, distanceY) < 90) dodgeTimeButton();
  }, { passive: true });

  timeBtn.addEventListener("touchstart", () => {
    dodgeTimeButton();
  }, { passive: true });
  timeBtn.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") {
      dodgeTimeButton();
      timeButtonReturnTimer = setTimeout(resetTimeButton, 900);
    }
  });

  const slideCount = 99;
  const slideDuration = 3200;
  let slideIndex = 0;
  let slideshowTimer = null;
  let progressTimer = null;
  let slideshowPlaying = false;
  let touchStartX = 0;

  const preloadSlides = () => {
    for (let i = 0; i < slideCount; i += 1) {
      const image = new Image();
      image.src = `assets/images/surprise-slides/${String(i + 1).padStart(4, "0")}.jpg`;
    }
  };

  const animateProgress = () => {
    clearInterval(progressTimer);
    if (slideProgress) {
      slideProgress.style.transition = "none";
      slideProgress.style.width = "0%";
      requestAnimationFrame(() => {
        slideProgress.style.transition = `width ${slideDuration}ms linear`;
        slideProgress.style.width = "100%";
      });
    }
  };

  const showSlide = (nextIndex, direction = 1) => {
    if (!surpriseSlide) return;
    slideIndex = (nextIndex + slideCount) % slideCount;
    surpriseSlide.classList.remove("is-visible", "slide-from-left", "slide-from-right");
    surpriseSlide.classList.add(direction < 0 ? "slide-from-left" : "slide-from-right");

    const nextSrc = `assets/images/surprise-slides/${String(slideIndex + 1).padStart(4, "0")}.jpg`;
    surpriseSlide.onload = () => {
      requestAnimationFrame(() => surpriseSlide.classList.add("is-visible"));
    };
    surpriseSlide.src = nextSrc;
    if (surpriseSlide.complete) requestAnimationFrame(() => surpriseSlide.classList.add("is-visible"));
    if (slideCounter) slideCounter.textContent = `${slideIndex + 1} / ${slideCount}`;
    if (slideshowPlaying) animateProgress();
  };

  const stopSlideshow = () => {
    clearInterval(slideshowTimer);
    clearInterval(progressTimer);
    slideshowTimer = null;
    slideshowPlaying = false;
    if (slidePlay) {
      slidePlay.textContent = "▶";
      slidePlay.setAttribute("aria-label", "Play slideshow");
    }
    if (slideProgress) slideProgress.style.transition = "none";
  };

  const startSlideshow = () => {
    stopSlideshow();
    slideshowPlaying = true;
    if (slidePlay) {
      slidePlay.textContent = "Ⅱ";
      slidePlay.setAttribute("aria-label", "Pause slideshow");
    }
    animateProgress();
    slideshowTimer = setInterval(() => showSlide(slideIndex + 1, 1), slideDuration);
  };

  const openSurpriseSlideshow = () => {
    if (!surpriseModal) return;
    surpriseModal.hidden = false;
    document.body.classList.add("modal-open");
    showSlide(slideIndex, 1);
    startSlideshow();
  };

  slidePrev?.addEventListener("click", () => {
    showSlide(slideIndex - 1, -1);
    if (slideshowPlaying) startSlideshow();
  });
  slideNext?.addEventListener("click", () => {
    showSlide(slideIndex + 1, 1);
    if (slideshowPlaying) startSlideshow();
  });
  slidePlay?.addEventListener("click", () => {
    if (slideshowPlaying) stopSlideshow();
    else startSlideshow();
  });

  const slideshow = document.getElementById("photo-slideshow");
  slideshow?.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  slideshow?.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 45) {
      showSlide(slideIndex + (distance < 0 ? 1 : -1), distance < 0 ? 1 : -1);
      if (slideshowPlaying) startSlideshow();
    }
  }, { passive: true });

  const closeSurprise = () => {
    stopSlideshow();
    slideIndex = 0;
    if (surpriseVideo) {
      surpriseVideo.pause();
      surpriseVideo.currentTime = 0;
    }
    if (surpriseModal) surpriseModal.hidden = true;
    document.body.classList.remove("modal-open");
    surpriseMusicPaused = false;
    resumeMusic();
  };

  surpriseClose?.addEventListener("click", closeSurprise);
  surpriseModal?.addEventListener("click", (event) => {
    if (event.target === surpriseModal) closeSurprise();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && surpriseModal && !surpriseModal.hidden) closeSurprise();
  });

}

function initializeChecker() {
  const unlocked = localStorage.getItem(unlockKey) === "true";

  if (unlocked) {
    document.body.classList.remove("login-active");
    loginScreen.classList.add("hidden");
    mainPage.classList.add("visible");
    loader.classList.add("hidden");
    setTimeout(() => resumeMusic(), 400);
    return;
  }

  loader.classList.remove("hidden");
  setTimeout(() => loader.classList.add("hidden"), 1200);
}

function initialize() {
  const girlfriendPhoto = document.querySelector(".photo-frame img");
  if (girlfriendPhoto) {
    girlfriendPhoto.src = config.photoPath;
  }

  createFloatingBackground();
  initializeMusic();
  setupDateMask();
  setupEnvelope();
  setupSurpriseButtons();
  loginForm.addEventListener("submit", handlePasswordSubmit);

  if (typewriter && typewriter.dataset.text) {
    typeText(typewriter, typewriter.dataset.text);
  }

  initializeChecker();
}

initialize();
