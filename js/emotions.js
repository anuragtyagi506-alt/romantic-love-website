const heartsContainer = document.querySelector(".emotion-hearts");
const cards = [...document.querySelectorAll("[data-card]")];
const replayButton = document.getElementById("replay-emotions");
const emotionsMusic = document.getElementById("emotions-music");

emotionsMusic.volume = 0.45;

async function playEmotionsMusic() {
  try {
    await emotionsMusic.play();
  } catch (error) {
    console.warn("Browser needs a gesture to play emotions music:", error);
  }
}

playEmotionsMusic();
document.addEventListener("pointerdown", playEmotionsMusic, { once: true });
document.addEventListener("keydown", playEmotionsMusic, { once: true });

function createFloatingHearts() {
  for (let i = 0; i < 18; i += 1) {
    const heart = document.createElement("span");
    heart.textContent = Math.random() > 0.35 ? "❤" : "✨";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${8 + Math.random() * 7}s`;
    heart.style.animationDelay = `${Math.random() * -14}s`;
    heart.style.fontSize = `${11 + Math.random() * 15}px`;
    heartsContainer.appendChild(heart);
  }
}

function restartAnimations() {
  cards.forEach((card) => {
    card.classList.remove("animate-card");
  });

  void document.getElementById("emotions-section").offsetWidth;

  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 180}ms`;
    card.classList.add("animate-card");
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

createFloatingHearts();
restartAnimations();
replayButton.addEventListener("click", () => {
  window.location.href = "memories.html";
});
