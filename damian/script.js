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

// Inicjalizacja
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

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
    showScreen('screen-reveal');
    updateGreeting();
    startRevealAnimation();
  });

  // Przycisk wyboru kierunku
  document.getElementById('btn-choose-destination').addEventListener('click', () => {
    showScreen('screen-destination');
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
    btn.addEventListener('click', () => {
      document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.duration = parseInt(btn.dataset.days);
      updateDateEnd();
    });
  });

  // Szybkie terminy
  document.querySelectorAll('.quick-date-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const month = parseInt(btn.dataset.month);
      const dates = getQuickDates(month, appState.duration);
      document.getElementById('date-start').value = dates.start;
      appState.dateStart = dates.start;
      updateDateEnd();
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
  document.getElementById('btn-copy').addEventListener('click', copySummary);
  document.getElementById('btn-email').addEventListener('click', (e) => {
    e.preventDefault();
    sendEmail();
  });
  document.getElementById('btn-change').addEventListener('click', () => {
    showScreen('screen-destination');
  });
}

// Funkcje pomocnicze
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  const targetScreen = document.getElementById(screenId);
  targetScreen.classList.add('active');
  
  // Scroll do góry
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateGreeting() {
  const greetingText = document.getElementById('greeting-text');
  greetingText.textContent = `${appState.name}, mam dla Ciebie…`;
}

function startRevealAnimation() {
  // Animacja już jest w CSS, ale możemy dodać dodatkowe efekty
  setTimeout(() => {
    document.getElementById('reveal-flight').style.opacity = '1';
  }, 200);
  setTimeout(() => {
    document.getElementById('reveal-spa').style.opacity = '1';
  }, 400);
  setTimeout(() => {
    document.getElementById('reveal-abroad').style.opacity = '1';
  }, 600);
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
    btn.textContent = 'Skopiowano!';
    btn.style.background = 'var(--color-success)';
    btn.style.color = 'white';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
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

