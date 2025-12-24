// Dane aplikacji
const appState = {
  name: '',
  destination: '',
  destinationName: '',
  duration: 3,
  dateStart: '',
  dateEnd: ''
};

// Mapowanie destynacji
const destinations = {
  budapest: {
    name: 'Budapeszt',
    description: 'Termalne łaźnie w sercu Węgier'
  },
  milan: {
    name: 'Mediolan + QC Terme Pré-Saint-Didier',
    description: 'Alpy, widok na Mont Blanc'
  },
  munich: {
    name: 'Monachium + Therme Erding',
    description: 'Największy kompleks termalny w Europie'
  },
  seville: {
    name: 'Sewilla + Aire Ancient Baths',
    description: 'Klimatyczne łaźnie w andaluzyjskim stylu'
  },
  slovenia: {
    name: 'Słowenia (Terme Olimia)',
    description: 'Spokojnie i jakościowo'
  }
};

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

// Inicjalizacja
document.addEventListener('DOMContentLoaded', () => {
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
  initSnow();

  initApp();
});

// Snow Effect
function initSnow() {
  const canvas = document.getElementById('snow-canvas');
  const ctx = canvas.getContext('2d');

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
  // Formularz imienia
  const nameForm = document.getElementById('name-form');
  const nameInput = document.getElementById('name-input');
  const nameError = document.getElementById('name-error');

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

  // Przycisk wyboru kierunku
  const btnChooseDestination = document.getElementById('btn-choose-destination');
  btnChooseDestination.addEventListener('click', (e) => {
    createRipple(e);
    setTimeout(() => {
      showScreen('screen-destination');
    }, 200);
  });

  // Formularz destynacji
  const destinationForm = document.getElementById('destination-form');
  const destinationError = document.getElementById('destination-error');

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
      document.getElementById('date-start').value = dates.start;
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
  dateStartInput.addEventListener('change', () => {
    appState.dateStart = dateStartInput.value;
    updateDateEnd();
  });

  // Ustaw minimalną datę na dzisiaj
  const today = new Date().toISOString().split('T')[0];
  dateStartInput.setAttribute('min', today);

  // Formularz dat
  const datesForm = document.getElementById('dates-form');
  const datesError = document.getElementById('dates-error');

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

  // Przyciski podsumowania
  document.getElementById('btn-copy').addEventListener('click', (e) => {
    createRipple(e);
    copySummary();
  });
  document.getElementById('btn-email').addEventListener('click', (e) => {
    e.preventDefault();
    createRipple(e);
    sendEmail();
  });
  document.getElementById('btn-change').addEventListener('click', (e) => {
    createRipple(e);
    setTimeout(() => {
      showScreen('screen-destination');
    }, 200);
  });
}

// Funkcje pomocnicze
function showScreen(screenId) {
  const currentScreen = document.querySelector('.screen.active');
  const targetScreen = document.getElementById(screenId);

  if (currentScreen) {
    currentScreen.classList.add('fade-out');
    setTimeout(() => {
      currentScreen.classList.remove('active', 'fade-out');
      targetScreen.classList.add('active');
      // Scroll do góry
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  } else {
    targetScreen.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}


function updateGreeting() {
  const greetingText = document.getElementById('greeting-text');
  greetingText.textContent = `${appState.name}, mam dla Ciebie…`;
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
  document.getElementById('date-start').value = '';
  document.getElementById('date-end').value = '';
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
  document.getElementById('date-end').value = endDateString;
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
  document.getElementById('summary-name').textContent = appState.name;
  document.getElementById('summary-destination').textContent = appState.destinationName;

  const startDate = new Date(appState.dateStart);
  const endDate = new Date(appState.dateEnd);
  const formatDate = (date) => {
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  document.getElementById('summary-dates').textContent =
    `${formatDate(startDate)} - ${formatDate(endDate)}`;
  document.getElementById('summary-duration').textContent = `${appState.duration} dni`;
}

function copySummary() {
  const summary = generateSummaryText();

  navigator.clipboard.writeText(summary).then(() => {
    const btn = document.getElementById('btn-copy');
    const originalText = btn.textContent;
    btn.textContent = '✓ Skopiowano!';
    btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    btn.style.color = 'white';
    btn.style.transform = 'scale(1.05)';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
      btn.style.transform = '';
    }, 2000);
  }).catch(() => {
    alert('Nie udało się skopiować. Spróbuj ponownie.');
  });
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

  document.getElementById('btn-email').href = mailtoLink;
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

