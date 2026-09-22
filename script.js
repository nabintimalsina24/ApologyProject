/* =========================================================
   MAIN MESSAGES: most of the copy lives directly in index.html.
   Look for the section comments there (CHANGE #6) if you want
   to tweak wording — this file only handles behavior.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. FLOATING HEARTS BACKGROUND
     --------------------------------------------------------- */
  const floatingLayer = document.getElementById('floatingLayer');
  const HEART_COUNT = window.innerWidth < 640 ? 10 : 16;

  for (let i = 0; i < HEART_COUNT; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = '❤';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (12 + Math.random() * 18) + 'px';
    heart.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    heart.style.animationDuration = (14 + Math.random() * 12) + 's';
    heart.style.animationDelay = (Math.random() * -20) + 's';
    floatingLayer.appendChild(heart);
  }

  /* ---------------------------------------------------------
     2. SCROLL REVEAL (fade + slide up as sections enter view)
     --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* Final section lines reveal one at a time, staggered */
  const finalLines = document.querySelectorAll('.final-section .reveal-line');
  const finalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        finalLines.forEach((line, i) => {
          setTimeout(() => line.classList.add('is-visible'), i * 450);
        });
        finalObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  if (finalLines.length) finalObserver.observe(finalLines[0]);

  /* ---------------------------------------------------------
     3. BACKGROUND MUSIC TOGGLE
     CHANGE #5: swap music/song.mp3 in index.html for your track.
     Browsers block autoplay with sound, so playback only starts
     after the visitor clicks the button — this is expected.
     --------------------------------------------------------- */
  const musicBtn = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');
  const iconMuted = document.getElementById('iconMuted');
  const iconPlaying = document.getElementById('iconPlaying');
  let isPlaying = false;

  musicBtn.addEventListener('click', async () => {
    try {
      if (!isPlaying) {
        await bgMusic.play();
        isPlaying = true;
        iconMuted.style.display = 'none';
        iconPlaying.style.display = 'block';
        musicBtn.setAttribute('aria-label', 'Pause background music');
      } else {
        bgMusic.pause();
        isPlaying = false;
        iconMuted.style.display = 'block';
        iconPlaying.style.display = 'none';
        musicBtn.setAttribute('aria-label', 'Play background music');
      }
    } catch (err) {
      // Autoplay/permission restrictions — fail silently and stay muted
      console.log('Music could not start automatically:', err);
    }
  });

  /* ---------------------------------------------------------
     4. FORGIVE ME BUTTON — heart burst + thank-you message
     --------------------------------------------------------- */
  const forgiveBtn = document.getElementById('forgiveBtn');
  const forgiveResponse = document.getElementById('forgiveResponse');
  const heartsCanvas = document.getElementById('heartsCanvas');
  const ctx = heartsCanvas.getContext('2d');

  function resizeCanvas() {
    heartsCanvas.width = window.innerWidth;
    heartsCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function burstHearts() {
    const particles = [];
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight / 2;

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.5) * 9,
        vy: (Math.random() - 1.6) * 9,
        size: 10 + Math.random() * 16,
        rotation: Math.random() * 360,
        opacity: 1,
        color: Math.random() > 0.5 ? '#A5253F' : '#E7B7A3'
      });
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);
      frame++;
      let stillAlive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18; // gravity
        p.opacity -= 0.012;
        p.rotation += p.vx;

        if (p.opacity > 0) {
          stillAlive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(p.opacity, 0);
          ctx.font = `${p.size}px serif`;
          ctx.fillStyle = p.color;
          ctx.textAlign = 'center';
          ctx.fillText('❤', 0, 0);
          ctx.restore();
        }
      });

      if (stillAlive) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);
      }
    }
    animate();
  }

  forgiveBtn.addEventListener('click', () => {
    burstHearts();
    forgiveResponse.hidden = false;
    forgiveBtn.disabled = true;
    forgiveBtn.style.opacity = '0.7';
  });

  /* ---------------------------------------------------------
     5. NEW CHAPTER BUTTON
     --------------------------------------------------------- */
  const chapterBtn = document.getElementById('chapterBtn');
  const chapterMessage = document.getElementById('chapterMessage');

  chapterBtn.addEventListener('click', () => {
    burstHearts();
    chapterMessage.hidden = false;
    chapterBtn.disabled = true;
    chapterBtn.style.opacity = '0.7';
  });

});
