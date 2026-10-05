// --- SPECIAL MESSAGES CAROUSEL ---
const messagesList = [
  "Happy Anniversary Cutieeeesssss 🎉",
  "One year down, a lifetime of cute memories to go! ❤️"
];

let currentMsgIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initConfetti();
  setupEventListeners();
});

// Setup click handlers
function setupEventListeners() {
  const btnMessages = document.getElementById('btn-messages');
  const nextMsgBtn = document.getElementById('next-msg');
  const messagesBox = document.getElementById('messages');

  if (btnMessages) {
    btnMessages.addEventListener('click', () => {
      showSection('messages');
      triggerConfetti();
    });
  }

  if (nextMsgBtn && messagesBox) {
    nextMsgBtn.addEventListener('click', () => {
      currentMsgIndex = (currentMsgIndex + 1) % messagesList.length;
      messagesBox.textContent = messagesList[currentMsgIndex];
      
      // If reached last message, add a option to jump to More Love section
      if (currentMsgIndex === messagesList.length - 1) {
        if (!document.getElementById('to-more-love-btn')) {
          const moreLoveBtn = document.createElement('button');
          moreLoveBtn.id = 'to-more-love-btn';
          moreLoveBtn.className = 'more-love-btn';
          moreLoveBtn.textContent = 'More Love Section ❤️';
          moreLoveBtn.onclick = () => showSection('More Love');
          nextMsgBtn.parentNode.insertBefore(moreLoveBtn, nextMsgBtn.nextSibling);
        }
      }
    });
  }
}

// --- SECTION SWITCHING FUNCTION ---
function showSection(sectionName) {
  const mainCard = document.getElementById('main-card');
  const messagesSection = document.getElementById('messages-section');
  const moreLoveSection = document.getElementById('More Love-section');

  // Pause audio elements when navigating
  document.querySelectorAll('audio').forEach(audio => audio.pause());

  // Hide everything first
  if (mainCard) mainCard.style.display = 'none';
  if (messagesSection) messagesSection.style.display = 'none';
  if (moreLoveSection) moreLoveSection.style.display = 'none';

  // Show selected section
  if (sectionName === 'main') {
    if (mainCard) mainCard.style.display = 'block';
  } else if (sectionName === 'messages') {
    if (messagesSection) {
      messagesSection.style.display = 'block';
      playAudio(messagesSection);
    }
  } else if (sectionName === 'More Love') {
    if (moreLoveSection) {
      moreLoveSection.style.display = 'block';
      playAudio(moreLoveSection);
      triggerConfetti();
    }
  }
}

function playAudio(container) {
  const audio = container.querySelector('audio');
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Browsers block autoplay until user interacts with document
      console.log('Autoplay waiting for user interaction');
    });
  }
}

// --- COUNTDOWN TIMER ---
function initCountdown() {
  const countdownEl = document.getElementById('countdown');
  const buttonsDiv = document.getElementById('buttons');

  // Set target date (e.g. 1 year anniversary date)
  // Adjust this target date as needed (Format: YYYY, Month Index (0-11), Day)
  const targetDate = new Date(); 
  targetDate.setSeconds(targetDate.getSeconds() + 3); // Unlocks in 3 seconds for quick testing!

  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      clearInterval(timer);
      if (countdownEl) countdownEl.innerHTML = "✨ Time to Celebrate! ✨";
      if (buttonsDiv) buttonsDiv.style.display = 'block';
      triggerConfetti();
    } else {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (countdownEl) {
        countdownEl.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
    }
  }, 1000);
}

// --- CANVAS CONFETTI EFFECT ---
let canvas, ctx, particles = [];

function initConfetti() {
  canvas = document.getElementById('confetti');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function triggerConfetti() {
  if (!canvas || !ctx) return;
  
  const colors = ['#ff416c', '#ff4b2b', '#ffeb3b', '#4caf50', '#00bcd4', '#ab47bc'];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.7) * 12,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  if (particles.length <= 80) {
    animateConfetti();
  }
}

function animateConfetti() {
  if (!ctx || particles.length === 0) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2; // Gravity
    p.rotation += p.rotSpeed;
    p.opacity -= 0.015;

    ctx.save();
    ctx.globalAlpha = Math.max(p.opacity, 0);
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();

    if (p.opacity <= 0) {
      particles.splice(index, 1);
    }
  });

  if (particles.length > 0) {
    requestAnimationFrame(animateConfetti);
  }
}
