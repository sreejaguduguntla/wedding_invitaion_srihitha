// ================================================
//  SRIHITHA & BHADRINATH — Wedding Invitation JS
// ================================================

// ===== FLOATING PETALS =====
const petalEmojis = ['🌸', '🌷', '🌺', '🏵️', '💮', '🌼'];

function createPetal() {
  const petal = document.createElement('div');
  petal.className = 'petal';
  petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
  petal.style.left = Math.random() * 100 + 'vw';
  petal.style.animationDuration = (Math.random() * 6 + 7) + 's';
  petal.style.animationDelay = Math.random() * 5 + 's';
  petal.style.fontSize = (Math.random() * 14 + 10) + 'px';
  petal.style.opacity = (Math.random() * 0.4 + 0.3);
  document.getElementById('petals').appendChild(petal);

  // Remove petal after animation completes
  setTimeout(() => {
    petal.remove();
  }, 14000);
}

// Create petals periodically
setInterval(createPetal, 800);
// Create initial burst
for (let i = 0; i < 8; i++) {
  setTimeout(createPetal, i * 200);
}

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
  const weddingDate = new Date('2026-11-25T09:34:00+05:30');
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    document.getElementById('countdown-timer').innerHTML =
      '<div style="font-family: var(--font-script); font-size: 2.5rem; color: white; grid-column: span 4;">🎉 The Big Day is Here! 🎉</div>';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll(
  '.event-card, .couple-card, .venue-detail-card, .gallery-item, .welcome-content, .couple-heart'
);

revealElements.forEach(el => {
  el.classList.add('reveal');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 80);
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => observer.observe(el));

// Blessings form removed (not used)

// ===== SMOOTH ANCHOR SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== CURSOR SPARKLES (desktop) =====
if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.85) {
      const sparkle = document.createElement('div');
      sparkle.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        pointer-events: none;
        z-index: 99999;
        font-size: ${Math.random() * 12 + 8}px;
        opacity: 1;
        transition: opacity 0.6s ease, transform 0.6s ease;
        user-select: none;
      `;
      sparkle.textContent = ['✨', '🌸', '💕', '⭐'][Math.floor(Math.random() * 4)];
      document.body.appendChild(sparkle);

      requestAnimationFrame(() => {
        sparkle.style.transform = `translateY(-30px) scale(0.5)`;
        sparkle.style.opacity = '0';
      });

      setTimeout(() => sparkle.remove(), 650);
    }
  });
}

// ===== TEAM VOTING LOGIC =====
function loadVoteData() {
  const data = JSON.parse(localStorage.getItem('team_votes') || '{"bride":0,"groom":0,"voted":false}');
  return data;
}
function saveVoteData(data) {
  localStorage.setItem('team_votes', JSON.stringify(data));
}
function updateVoteUI() {
  const data = loadVoteData();

  // disable buttons after vote & show badge
  if (data.voted) {
    document.getElementById('btn-bride').disabled = true;
    document.getElementById('btn-groom').disabled = true;
    if (data.lastChoice === 'bride') {
      document.getElementById('bride-badge').style.display = 'block';
    } else {
      document.getElementById('groom-badge').style.display = 'block';
    }
  }

  // reaction message
  const reactionEl = document.getElementById('team-reaction');
  if (data.voted) {
    reactionEl.textContent = data.lastChoice === 'bride'
      ? '💖 You are on Team Bride! Let the love flow.'
      : '💙 You stand with Team Groom! Cheers!';
    reactionEl.style.opacity = 1;
  } else {
    reactionEl.textContent = '';
    reactionEl.style.opacity = 0;
  }

  // scoreboard bar (no counts shown, just the proportional bar)
  const total = data.bride + data.groom;
  const scoreboard = document.getElementById('scoreboard');
  if (total > 0) {
    scoreboard.style.display = 'block';
    document.getElementById('bride-fill').style.width = (data.bride / total * 100) + '%';
    document.getElementById('groom-fill').style.width = (data.groom / total * 100) + '%';
  } else {
    scoreboard.style.display = 'none';
  }
}
function castVote(team) {
  const data = loadVoteData();
  if (data.voted) return; // only one vote per visitor
  if (team === 'bride') data.bride++;
  else if (team === 'groom') data.groom++;
  data.voted = true;
  data.lastChoice = team;
  saveVoteData(data);
  updateVoteUI();
  launchConfetti();
}
function launchConfetti() {
  const container = document.getElementById('confetti-container');
  const emojis = ['🎉','🥳','💥','✨','💖','💙'];
  for (let i = 0; i < 30; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.animationDuration = (Math.random() * 2 + 3) + 's';
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 4000);
  }
}
// Initialise UI on load
updateVoteUI();

console.log('💍 Srihitha & Bhadrinath | 25th November 2026 | Made with Love ❤️');

// ===== BACKGROUND MUSIC =====
const START_TIME = 70; // 1 minute 10 seconds
let _musicStarted = false;

function startMusic() {
  if (_musicStarted) return;
  _musicStarted = true;
  const audio = document.getElementById('bg-music');
  const btn   = document.getElementById('music-toggle');
  const icon  = document.getElementById('music-icon');
  const info  = document.getElementById('music-info');
  audio.currentTime = START_TIME;
  audio.volume = 0.6;
  audio.play().catch(() => {});
  btn.classList.remove('paused');
  icon.textContent = '🎵';
  // Show song name briefly
  info.classList.add('visible');
  setTimeout(() => info.classList.remove('visible'), 4000);
  // Loop back to 1:10 instead of beginning
  audio.addEventListener('ended', () => {
    audio.currentTime = START_TIME;
    audio.play().catch(() => {});
  });
}

// Music toggle button (play/pause)
document.getElementById('music-toggle').addEventListener('click', (e) => {
  e.stopPropagation();
  const audio = document.getElementById('bg-music');
  const icon  = document.getElementById('music-icon');
  const btn   = document.getElementById('music-toggle');
  if (!_musicStarted) { startMusic(); return; }
  if (audio.paused) {
    audio.play().catch(() => {});
    btn.classList.remove('paused');
    icon.textContent = '🎵';
  } else {
    audio.pause();
    btn.classList.add('paused');
    icon.textContent = '🔇';
  }
});

// ===== ENVELOPE INTRO =====
let _torn = false;

function initEnvStars() {
  const layer = document.getElementById('env-stars-layer');
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'env-star';
    const size = Math.random() * 3 + 1;
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${size}px;height:${size}px;--dur:${(Math.random()*2.5+1.5).toFixed(1)}s;--delay:${(Math.random()*3).toFixed(1)}s;`;
    layer.appendChild(s);
  }
}

function burstParticles() {
  const emojis = ['✨','🌸','💕','🌺','💍','⭐','🌼','💖'];
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'env-burst-particle';
    const angle = (Math.PI * 2 / 22) * i;
    const dist  = 80 + Math.random() * 140;
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.cssText = `left:${cx}px;top:${cy}px;--tx:${(Math.cos(angle)*dist).toFixed(0)}px;--ty:${(Math.sin(angle)*dist-60).toFixed(0)}px;--fly-dur:${(Math.random()*0.4+0.7).toFixed(2)}s;animation-delay:${(Math.random()*0.1).toFixed(2)}s;`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1300);
  }
}

function tearEnvelope() {
  if (_torn) return;
  _torn = true;

  const stage = document.getElementById('env-stage');
  const intro = document.getElementById('env-intro');
  const cta   = document.getElementById('env-cta');

  cta.style.opacity = '0';
  cta.style.transition = 'opacity 0.2s ease';

  // Trigger the split animation
  stage.classList.add('tearing');

  // Particle burst + music start
  burstParticles();
  startMusic();

  // Fade out whole intro
  setTimeout(() => intro.classList.add('opening'), 450);

  // Remove intro and restore scrolling
  setTimeout(() => {
    intro.style.display = 'none';
    document.body.classList.remove('intro-active');
  }, 1050);
}

// Boot
initEnvStars();
