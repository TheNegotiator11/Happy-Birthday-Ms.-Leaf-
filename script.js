const flame = document.querySelector(".flame");

// Tap candle to extinguish
flame.addEventListener("click", () => {
  flame.classList.add("off");
  checkAllOut();
});

// Update checkAllOut to only check flame
function checkAllOut() {
  if (flame.classList.contains("off")) {
    if (!blownOut) {
      triggerCelebration();
    }
  }
}

// Mic blowout also kills flame
function extinguishFlame() {
  flame.classList.add("off");
  checkAllOut();
}
