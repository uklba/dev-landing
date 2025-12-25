// Script loaded check - CRITICAL: This should appear first in console
// Uncomment the alert below if you don't see any console messages
// alert('Script.js loaded! Check console for details.');

console.log('🚀🚀🚀 Script.js file loaded and executing 🚀🚀🚀');
console.log('🚀 Script execution started at:', new Date().toISOString());
console.log('🚀 Window object exists:', typeof window !== 'undefined');
console.log('🚀 Document object exists:', typeof document !== 'undefined');

// Test if console works
if (typeof console !== 'undefined') {
  console.log('✅ Console is available');
} else {
  alert('Console not available - this is a problem!');
}

// Immediate test - this should work even if DOM is not ready
try {
  console.log('✅ Script execution test passed');
} catch (e) {
  alert('Script execution failed: ' + e.message);
  throw e; // Re-throw to stop execution
}

// Dane aplikacji
const appState = {
  name: '',
  destination: '',
  destinationName: '',
  duration: 3,
  dateStart: '',
  dateEnd: ''
};
console.log('✅ appState initialized');

// Mapowanie destynacji
const destinations = {
  ischia: {
    name: 'Giardini Poseidon Terme (Ischia)',
    description: 'Największy park termalny na wyspie Ischia'
  },
  budapest: {
    name: 'Budapeszt (Łaźnie Széchenyi + Zwiedzanie)',
    description: 'Historyczne termy i spacer po stolicy Węgier'
  },
  iceland: {
    name: 'Islandia',
    description: 'Loty + zwiedzanie wyspy'
  },
  milan: {
    name: 'Mediolan (Zwiedzanie) + QC Terme (Alpy)',
    description: 'Luksusowe spa w górach i zwiedzanie Mediolanu'
  },
  munich: {
    name: 'Monachium + Therme Erding + BMW Welt',
    description: 'Termy, zwiedzanie miasta i BMW Welt'
  },
  saturnia: {
    name: 'Terme di Saturnia (Toskania)',
    description: 'Naturalne źródła siarkowe w Toskanii'
  }
};
console.log('✅ destinations initialized');

// Ripple effect dla przycisków
function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add('ripple');

  const ripple = button.getElementsByClassName('ripple')[0];
  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);

  setTimeout(() => {
    circle.remove();
  }, 600);
}

// Global error handler
window.addEventListener('error', (event) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:60', message: 'Global error caught', data: { message: event.message, filename: event.filename, lineno: event.lineno, colno: event.colno, error: event.error ? event.error.toString() : null }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run3', hypothesisId: 'E' }) }).catch(() => { });
  // #endregion
  console.error('🔴 Global error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:60', message: 'Unhandled promise rejection', data: { reason: event.reason ? event.reason.toString() : null }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run3', hypothesisId: 'E' }) }).catch(() => { });
  // #endregion
  console.error('Unhandled promise rejection:', event.reason);
});

// Inicjalizacja
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM is already loaded
  init();
}

function init() {
  console.log('✅ DOMContentLoaded fired');
  console.log('🟡 Document ready state:', document.readyState);
  console.log('🟡 Document body exists:', !!document.body);
  console.log('🟡 Number of screens found:', document.querySelectorAll('.screen').length);
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:60', message: 'DOMContentLoaded fired', data: { timestamp: Date.now() }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run3', hypothesisId: 'E' }) }).catch(() => { });
  // #endregion
  // Dodaj style dla ripple
  const style = document.createElement('style');
  style.textContent = `
    .btn {
      position: relative;
      overflow: hidden;
    }
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    }
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Init Snow
  try {
    initSnow();
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:89', message: 'initSnow error', data: { error: error.message, stack: error.stack }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run3', hypothesisId: 'D' }) }).catch(() => { });
    // #endregion
    console.error('Error initializing snow:', error);
  }

  try {
    console.log('🟡 Starting initApp...');
    initApp();
    console.log('✅ initApp completed successfully');
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:88', message: 'initApp completed successfully', data: { timestamp: Date.now() }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
    // #endregion
  } catch (error) {
    console.error('🔴 Error initializing app:', error);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:88', message: 'initApp error', data: { error: error.message, stack: error.stack }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
    // #endregion
  }
}

// Snow Effect
function initSnow() {
  const canvas = document.getElementById('snow-canvas');
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:105', message: 'initSnow started', data: { canvasExists: !!canvas }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run3', hypothesisId: 'D' }) }).catch(() => { });
  // #endregion
  if (!canvas) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:105', message: 'snow-canvas not found', data: { error: 'Missing canvas element' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run3', hypothesisId: 'D' }) }).catch(() => { });
    // #endregion
    console.error('Snow canvas not found');
    return;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:105', message: 'Cannot get 2d context', data: { error: 'Context error' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run3', hypothesisId: 'D' }) }).catch(() => { });
    // #endregion
    console.error('Cannot get 2d context');
    return;
  }

  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  const particles = [];
  const particleCount = 100;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3 + 1,
      d: Math.random() * particleCount,
      speed: Math.random() * 0.5 + 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();

    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
    }

    ctx.fill();
    update();
    requestAnimationFrame(draw);
  }

  function update() {
    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];
      p.y += p.speed;
      p.x += Math.sin(p.d) * 0.5;

      if (p.x > width + 5 || p.x < -5 || p.y > height) {
        p.x = Math.random() * width;
        p.y = -10;
      }
    }
  }

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });

  draw();
}

function triggerConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 100
  };

  // Simple manual confetti particles if no library
  // Just creating a few DIVs that fall down
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = ['#D42426', '#165B33', '#F8B229', '#FFF'][Math.floor(Math.random() * 4)];
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = '50%';
    confetti.style.transition = 'top 2s ease-out, transform 2s ease-out';
    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.style.top = '110vh';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    }, 100);

    setTimeout(() => {
      confetti.remove();
    }, 2000);
  }
}

function initApp() {
  console.log('🟡 initApp started');
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:186', message: 'initApp started', data: { timestamp: Date.now() }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
  // #endregion
  // Formularz imienia
  const nameForm = document.getElementById('name-form');
  const nameInput = document.getElementById('name-input');
  const nameError = document.getElementById('name-error');
  console.log('🟡 Checking name form elements:', {
    nameForm: !!nameForm,
    nameInput: !!nameInput,
    nameError: !!nameError
  });
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:204', message: 'Checking name form elements', data: { nameFormExists: !!nameForm, nameInputExists: !!nameInput, nameErrorExists: !!nameError }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run2', hypothesisId: 'C' }) }).catch(() => { });
  // #endregion

  if (!nameForm || !nameInput || !nameError) {
    console.error('🔴 Missing name form elements:', {
      nameForm: !!nameForm,
      nameInput: !!nameInput,
      nameError: !!nameError
    });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:208', message: 'Missing name form elements', data: { error: 'Critical elements missing' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run2', hypothesisId: 'C' }) }).catch(() => { });
    // #endregion
    return;
  }

  console.log('✅ Name form elements found, adding event listener');

  nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();

    if (!name) {
      showError(nameError, 'Proszę wpisać imię');
      nameInput.focus();
      return;
    }

    const normalizedName = name.toLowerCase();
    if (normalizedName !== 'damian') {
      showError(nameError, 'To nie jest poprawne imię');
      nameInput.focus();
      return;
    }


    hideError(nameError);
    appState.name = name;

    // Start Sequence
    // 1. Christmas Wishes
    showScreen('screen-wishes');
    triggerConfetti();

    // 2. Birthday Tease (after 3s)
    setTimeout(() => {
      showScreen('screen-birthday');
    }, 3500);

    // 3. Main Reveal (after another 3.5s)
    setTimeout(() => {
      showScreen('screen-reveal');
      updateGreeting();
      startRevealAnimation();
      triggerConfetti();
    }, 7000);
  });

  // Przycisk wyboru kierunku -> Start Presentation Mode
  const btnChooseDestination = document.getElementById('btn-choose-destination');
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:249', message: 'Checking btn-choose-destination', data: { btnExists: !!btnChooseDestination }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run2', hypothesisId: 'C' }) }).catch(() => { });
  // #endregion
  if (btnChooseDestination) {
    btnChooseDestination.addEventListener('click', (e) => {
      createRipple(e);
      initPresentation();
      setTimeout(() => {
        showScreen('screen-presentation');
      }, 200);
    });
  } else {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:249', message: 'btn-choose-destination not found', data: { error: 'Missing element' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run2', hypothesisId: 'C' }) }).catch(() => { });
    // #endregion
  }

  // Presentation Logic
  const btnPresentationNext = document.getElementById('btn-presentation-next');
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:259', message: 'Checking btn-presentation-next', data: { btnExists: !!btnPresentationNext }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run2', hypothesisId: 'C' }) }).catch(() => { });
  // #endregion
  if (btnPresentationNext) {
    btnPresentationNext.addEventListener('click', (e) => {
      createRipple(e);
      nextPresentationSlide();
    });
  } else {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:259', message: 'btn-presentation-next not found', data: { error: 'Missing element' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run2', hypothesisId: 'C' }) }).catch(() => { });
    // #endregion
  }

  const btnPresentationPrev = document.getElementById('btn-presentation-prev');
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:265', message: 'Checking btn-presentation-prev', data: { btnExists: !!btnPresentationPrev }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run2', hypothesisId: 'C' }) }).catch(() => { });
  // #endregion
  if (btnPresentationPrev) {
    btnPresentationPrev.addEventListener('click', (e) => {
      createRipple(e);
      prevPresentationSlide();
    });
  } else {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:265', message: 'btn-presentation-prev not found', data: { error: 'Missing element' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run2', hypothesisId: 'C' }) }).catch(() => { });
    // #endregion
  }

  // Formularz destynacji
  const destinationForm = document.getElementById('destination-form');
  const destinationError = document.getElementById('destination-error');
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:272', message: 'Checking destination form elements', data: { formExists: !!destinationForm, errorExists: !!destinationError }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run2', hypothesisId: 'C' }) }).catch(() => { });
  // #endregion

  if (destinationForm && destinationError) {
    destinationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const selected = document.querySelector('input[name="destination"]:checked');

      if (!selected) {
        showError(destinationError, 'Proszę wybrać destynację');
        return;
      }

      hideError(destinationError);
      appState.destination = selected.value;
      appState.destinationName = destinations[selected.value].name;
      showScreen('screen-dates');
      initDatesScreen();
    });
  } else {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:272', message: 'destination form elements not found', data: { error: 'Missing elements' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run2', hypothesisId: 'C' }) }).catch(() => { });
    // #endregion
  }

  // Przyciski długości pobytu
  document.querySelectorAll('.duration-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      createRipple(e);
      document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.duration = parseInt(btn.dataset.days);
      updateDateEnd();
    });
  });

  // Szybkie terminy
  document.querySelectorAll('.quick-date-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      createRipple(e);
      const month = parseInt(btn.dataset.month);
      const dates = getQuickDates(month, appState.duration);
      const dateStartInput = document.getElementById('date-start');
      if (dateStartInput) {
        dateStartInput.value = dates.start;
      }
      appState.dateStart = dates.start;
      updateDateEnd();

      // Animacja potwierdzenia
      btn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);
    });
  });

  // Input daty startowej
  const dateStartInput = document.getElementById('date-start');
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:321', message: 'Checking date-start input', data: { inputExists: !!dateStartInput }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run2', hypothesisId: 'C' }) }).catch(() => { });
  // #endregion
  if (dateStartInput) {
    dateStartInput.addEventListener('change', () => {
      appState.dateStart = dateStartInput.value;
      updateDateEnd();
    });

    // Ustaw minimalną datę na dzisiaj
    // Ustaw minimalną datę na 2026-01-01
    const minDate = '2026-01-01';
    dateStartInput.setAttribute('min', minDate);
  } else {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:321', message: 'date-start input not found', data: { error: 'Missing element' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run2', hypothesisId: 'C' }) }).catch(() => { });
    // #endregion
  }

  // Formularz dat
  const datesForm = document.getElementById('dates-form');
  const datesError = document.getElementById('dates-error');
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:332', message: 'Checking dates form elements', data: { formExists: !!datesForm, errorExists: !!datesError }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run2', hypothesisId: 'C' }) }).catch(() => { });
  // #endregion

  if (datesForm && datesError) {
    datesForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!appState.dateStart || !appState.dateEnd) {
        showError(datesError, 'Proszę wybrać daty');
        return;
      }

      // Walidacja dat
      const start = new Date(appState.dateStart);
      const end = new Date(appState.dateEnd);
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      if (diffDays !== appState.duration) {
        showError(datesError, `Termin musi trwać dokładnie ${appState.duration} dni`);
        return;
      }

      if (start < new Date(today)) {
        showError(datesError, 'Data rozpoczęcia nie może być w przeszłości');
        return;
      }

      hideError(datesError);
      showScreen('screen-summary');
      updateSummary();
    });
  } else {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:332', message: 'dates form elements not found', data: { error: 'Missing elements' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run2', hypothesisId: 'C' }) }).catch(() => { });
    // #endregion
  }

  // Przyciski podsumowania
  // #region agent log
  if (btnEmail) {
    btnEmail.addEventListener('click', (e) => {
      e.preventDefault();
      createRipple(e);
      sendEmail();
    });
  } else {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:346', message: 'btn-email element not found', data: { error: 'Missing element' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
    // #endregion
  }
}

// Funkcje pomocnicze
function showScreen(screenId) {
  console.log('🟡 showScreen called with:', screenId);
  const currentScreen = document.querySelector('.screen.active');
  const targetScreen = document.getElementById(screenId);

  if (!targetScreen) {
    console.error('🔴 Target screen not found:', screenId);
    return;
  }

  console.log('✅ Target screen found:', screenId);

  if (currentScreen) {
    currentScreen.classList.add('fade-out');
    setTimeout(() => {
      currentScreen.classList.remove('active', 'fade-out');
      targetScreen.classList.add('active');
      // Scroll do góry
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log('✅ Screen switched to:', screenId);
    }, 300);
  } else {
    targetScreen.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('✅ Screen activated:', screenId);
  }
}


function updateGreeting() {
  const greetingText = document.getElementById('greeting-text');
  if (greetingText) {
    greetingText.textContent = `${appState.name}, mam dla Ciebie…`;
  }
}

function startRevealAnimation() {
  // Dodatkowe efekty interaktywne
  const items = ['reveal-flight', 'reveal-spa', 'reveal-abroad'];
  items.forEach((id, index) => {
    const item = document.getElementById(id);
    setTimeout(() => {
      item.style.opacity = '1';
      // Dodaj efekt hover z animacją
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.15) rotate(5deg)';
      });
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1) rotate(0deg)';
      });
    }, 200 + (index * 200));
  });
}

function initDatesScreen() {
  // Reset dat
  const dateStartInput = document.getElementById('date-start');
  const dateEndInput = document.getElementById('date-end');
  if (dateStartInput) dateStartInput.value = '';
  if (dateEndInput) dateEndInput.value = '';
  appState.dateStart = '';
  appState.dateEnd = '';

  // Ustaw domyślną długość na 3 dni
  document.querySelectorAll('.duration-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.days === '3') {
      btn.classList.add('active');
    }
  });
  appState.duration = 3;
}

function updateDateEnd() {
  if (!appState.dateStart) return;

  const start = new Date(appState.dateStart);
  const end = new Date(start);
  end.setDate(end.getDate() + appState.duration);

  const endDateString = end.toISOString().split('T')[0];
  const dateEndInput = document.getElementById('date-end');
  if (dateEndInput) {
    dateEndInput.value = endDateString;
  }
  appState.dateEnd = endDateString;
}

function getQuickDates(month, duration) {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Znajdź najbliższy piątek w danym miesiącu
  const targetMonth = new Date(currentYear, month, 1);
  let friday = new Date(targetMonth);

  // Znajdź pierwszy piątek miesiąca (piątek = 5)
  const firstDay = friday.getDay();
  const daysToAdd = firstDay <= 5 ? (5 - firstDay) : (12 - firstDay);
  friday.setDate(1 + daysToAdd);

  // Jeśli piątek już minął, weź następny
  if (friday < now) {
    friday.setDate(friday.getDate() + 7);
  }

  // Jeśli piątek jest w przyszłym miesiącu, weź pierwszy piątek tego miesiąca
  if (friday.getMonth() !== month) {
    friday = new Date(targetMonth);
    const firstDay = friday.getDay();
    const daysToAdd = firstDay <= 5 ? (5 - firstDay) : (12 - firstDay);
    friday.setDate(1 + daysToAdd);
  }

  const end = new Date(friday);
  end.setDate(end.getDate() + duration);

  return {
    start: friday.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  };
}

function updateSummary() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:616', message: 'updateSummary called', data: { name: appState.name, destination: appState.destinationName }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run3', hypothesisId: 'F' }) }).catch(() => { });
  // #endregion

  const summaryName = document.getElementById('summary-name');
  const summaryDestination = document.getElementById('summary-destination');
  const summaryDates = document.getElementById('summary-dates');
  const summaryDuration = document.getElementById('summary-duration');

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/323f44ed-d8f7-4c8d-8940-3ac1270b9c8d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'script.js:616', message: 'Checking summary elements', data: { nameExists: !!summaryName, destinationExists: !!summaryDestination, datesExists: !!summaryDates, durationExists: !!summaryDuration }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run3', hypothesisId: 'F' }) }).catch(() => { });
  // #endregion

  if (summaryName) summaryName.textContent = appState.name;
  if (summaryDestination) summaryDestination.textContent = appState.destinationName;

  const startDate = new Date(appState.dateStart);
  const endDate = new Date(appState.dateEnd);
  const formatDate = (date) => {
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (summaryDates) {
    summaryDates.textContent = `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }
  if (summaryDuration) {
    summaryDuration.textContent = `${appState.duration} dni`;
  }
}



function generateSummaryText() {
  const startDate = new Date(appState.dateStart);
  const endDate = new Date(appState.dateEnd);
  const formatDate = (date) => {
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return `Prezent dla ${appState.name}

Destynacja: ${appState.destinationName}
Termin: ${formatDate(startDate)} - ${formatDate(endDate)}
Długość: ${appState.duration} dni`;
}

function sendEmail() {
  const subject = encodeURIComponent(`Prezent świąteczny - wybór Damiana`);
  const body = encodeURIComponent(generateSummaryText());
  const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

  const btnEmail = document.getElementById('btn-email');
  if (btnEmail) {
    btnEmail.href = mailtoLink;
  }
  // Otwórz w nowym oknie (jeśli to możliwe)
  window.location.href = mailtoLink;
}

function showError(errorElement, message) {
  errorElement.textContent = message;
  errorElement.classList.add('show');
}

function hideError(errorElement) {
  errorElement.classList.remove('show');
  errorElement.textContent = '';
}

// Obsługa klawisza Enter w formularzach
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
    const form = e.target.closest('form');
    if (form) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn && !submitBtn.disabled) {
        e.preventDefault();
        submitBtn.click();
      }
    }
  }
});


// Presentation State
let currentSlideIndex = 0;
let slideItems = [];

function initPresentation() {
  currentSlideIndex = 0;
  // Collect data directly from DOM elements in the hidden list
  const cards = document.querySelectorAll('.destination-grid .destination-card .card-content');
  slideItems = Array.from(cards).map(card => card.innerHTML);

  renderSlide(currentSlideIndex);
}

function renderSlide(index) {
  const container = document.getElementById('presentation-content');
  const indexDisplay = document.getElementById('presentation-index');
  const btnNext = document.getElementById('btn-presentation-next');
  const btnPrev = document.getElementById('btn-presentation-prev');

  if (!container || !indexDisplay || !btnNext || !btnPrev) {
    console.error('Missing presentation elements');
    return;
  }

  container.innerHTML = `<div class="card-content slide-enter">${slideItems[index]}</div>`;
  indexDisplay.textContent = index + 1;

  // Change button text on last slide
  if (index === slideItems.length - 1) {
    btnNext.textContent = 'Przejdź do wyboru';
    btnNext.classList.add('btn-highlight'); // Optional extra style
  } else {
    btnNext.textContent = 'Zobacz kolejną';
    btnNext.classList.remove('btn-highlight');
  }

  // Show/hide prev button on first slide
  if (index === 0) {
    btnPrev.style.display = 'none';
  } else {
    btnPrev.style.display = 'inline-block';
  }
}

function nextPresentationSlide() {
  if (currentSlideIndex < slideItems.length - 1) {
    currentSlideIndex++;
    // Animate out? Simple replacement for now, CSS handles entry animation
    renderSlide(currentSlideIndex);
  } else {
    // End of presentation, go to selection
    showScreen('screen-destination');
  }
}

function prevPresentationSlide() {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    renderSlide(currentSlideIndex);
  } else {
    // Go back to reveal screen
    showScreen('screen-reveal');
  }
}
