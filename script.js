const candles = document.querySelectorAll(".candle");
const nextBtn = document.getElementById("nextBtn");
const music = document.getElementById("music");
let blownOut = false;

// Tap to extinguish
candles.forEach(candle => {
  candle.addEventListener("click", () => {
    candle.classList.remove("lit");
    candle.classList.add("off");
    checkAllOut();
  });
});

// Check if all candles are out
function checkAllOut() {
  if ([...candles].every(c => c.classList.contains("off"))) {
    if (!blownOut) {
      triggerCelebration();
    }
  }
}

// Celebration function
function triggerCelebration() {
  blownOut = true;
  music.play();
  startConfetti();
  nextBtn.style.display = "inline-block";
}

// Microphone input (blowing detection)
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    source.connect(analyser);
    const data = new Uint8Array(analyser.fftSize);

    function detectBlow() {
      analyser.getByteTimeDomainData(data);
      let volume = 0;
      for (let i = 0; i < data.length; i++) {
        volume += Math.abs(data[i] - 128);
      }
      volume = volume / data.length;
      if (volume > 15) { // threshold for "blow"
        candles.forEach(c => {
          c.classList.remove("lit");
          c.classList.add("off");
        });
        checkAllOut();
      }
      requestAnimationFrame(detectBlow);
    }
    detectBlow();
  })
  .catch(err => {
    document.getElementById("instructions").innerText = "Microphone blocked. Tap candles to blow them out!";
  });

// Confetti effect
function startConfetti() {
  const confetti = document.getElementById("confetti");
  const ctx = confetti.getContext("2d");
  confetti.width = window.innerWidth;
  confetti.height = window.innerHeight;

  const pieces = Array.from({ length: 150 }, () => ({
    x: Math.random() * confetti.width,
    y: Math.random() * confetti.height - confetti.height,
    w: 10, h: 20,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    speed: Math.random() + 1
  }));

  function draw() {
    ctx.clearRect(0, 0, confetti.width, confetti.height);
    pieces.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      p.y += p.speed;
      if (p.y > confetti.height) p.y = -20;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// Next button
nextBtn.addEventListener("click", () => {
  window.location.href = "surprise.html";
});
