/**
 * Пища с любовью от Рупавати • JavaScript
 * Интерактивность, тест на доши, модальные окна, фильтры рецептов, переключатель языка
 * Оптимизация под клавиатуру планшета (Arrow keys, 1/2/3, Enter, Esc) и тач-устройства
 */

document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitcher();
  initRecipeFilters();
  initMobileMenu();
  initKeyboardSupport();
  initQuizTouchSelection();
});

/* ========================================================
   1. ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА (RU / EN)
   ======================================================== */
function initLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-btn');
  
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const lang = btn.getAttribute('data-lang');
      applyLanguage(lang);
    });
  });
}

function applyLanguage(lang) {
  const translatableElements = document.querySelectorAll('[data-ru]');
  translatableElements.forEach(el => {
    let text = el.getAttribute(`data-${lang}`);
    // Если выбран украинский (ua / ukr) и нет прямого атрибута data-ua
    if (!text && (lang === 'ua' || lang === 'ukr')) {
      const ruText = el.getAttribute('data-ru');
      if (typeof uaTranslations !== 'undefined' && uaTranslations[ruText]) {
        text = uaTranslations[ruText];
      }
    }
    if (text) {
      el.innerHTML = text;
    }
  });

  document.documentElement.lang = lang;
}

/* ========================================================
   2. ФИЛЬТРЫ РЕЦЕПТОВ
   ======================================================== */
function initRecipeFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const recipeCards = document.querySelectorAll('.recipe-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      recipeCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ========================================================
   3. ИНТЕРАКТИВНЫЙ ТЕСТ НА ДОШИ (QUIZ)
   ======================================================== */
let currentQuizStep = 1;

function initQuizTouchSelection() {
  // Подсветка выбранной карточки для удобства тача на планшетах и смартфонах
  document.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const parent = opt.closest('.quiz-options');
      parent.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
}

function nextQuizStep(step) {
  const activeStep = document.querySelector(`.quiz-step[data-step="${currentQuizStep}"]`);
  const selected = activeStep.querySelector('input[type="radio"]:checked');
  
  if (!selected) {
    alert('Пожалуйста, выберите один из вариантов ответа (или нажмите клавишу 1, 2 или 3)');
    return;
  }

  activeStep.classList.remove('active');
  currentQuizStep = step;
  const nextStepEl = document.querySelector(`.quiz-step[data-step="${currentQuizStep}"]`);
  if (nextStepEl) {
    nextStepEl.classList.add('active');
  }
}

function prevQuizStep(step) {
  const activeStep = document.querySelector(`.quiz-step[data-step="${currentQuizStep}"]`);
  activeStep.classList.remove('active');
  currentQuizStep = step;
  const prevStepEl = document.querySelector(`.quiz-step[data-step="${currentQuizStep}"]`);
  if (prevStepEl) {
    prevStepEl.classList.add('active');
  }
}

function calculateQuizResult() {
  const activeStep = document.querySelector(`.quiz-step[data-step="3"]`);
  const selected = activeStep.querySelector('input[type="radio"]:checked');
  if (!selected) {
    alert('Пожалуйста, ответьте на 3-й вопрос (или нажмите клавишу 1, 2 или 3)');
    return;
  }

  const q1 = document.querySelector('input[name="q1"]:checked')?.value || 'vata';
  const q2 = document.querySelector('input[name="q2"]:checked')?.value || 'vata';
  const q3 = document.querySelector('input[name="q3"]:checked')?.value || 'vata';

  const counts = { vata: 0, pitta: 0, kapha: 0 };
  counts[q1]++;
  counts[q2]++;
  counts[q3]++;

  let dominant = 'vata';
  if (counts.pitta > counts.vata && counts.pitta >= counts.kapha) dominant = 'pitta';
  else if (counts.kapha > counts.vata && counts.kapha > counts.pitta) dominant = 'kapha';

  displayQuizResult(dominant);
}

function displayQuizResult(dosha) {
  document.querySelectorAll('.quiz-step').forEach(step => step.classList.remove('active'));
  
  const resultBox = document.getElementById('quiz-result');
  const resultTitle = document.getElementById('result-title');
  const resultDesc = document.getElementById('result-desc');
  const dishesGrid = document.getElementById('result-dishes');

  const doshaData = {
    vata: {
      title: 'Ваша ведущая конституция: Вата (Воздух и Эфир)',
      desc: 'Вы человек чуткий, творческий и переменчивый. При дисбалансе появляется беспокойство ума, сухость и упадок сил. Вам необходимо регулярное питание, тепло, маслянистость и заземляющие блюда. Избегайте холодной сухомятки и сырых салатов зимой.',
      dishes: [
        { name: 'Золотой суп Дал', page: 'Стр. 70', note: 'Маш, куркума и масло Гхи' },
        { name: 'Пшённая каша с курагой', page: 'Стр. 20', note: 'Теплое заземление на завтрак' },
        { name: 'Йоговское молоко', page: 'Стр. 106', note: 'Мускатный орех и кардамон на ночь' }
      ]
    },
    pitta: {
      title: 'Ваша ведущая конституция: Питта (Огонь и Вода)',
      desc: 'Вы обладаете сильной волей, ясным умом и высоким метаболизмом. При дисбалансе огонь перегревает тело, вызывая раздражительность и изжогу. Вам подходят охлаждающие, сочные блюда, сладкие и вяжущие вкусы. Избегайте чрезмерно острой, соленой и уксусной пищи.',
      dishes: [
        { name: 'Крем-суп из брокколи', page: 'Стр. 73', note: 'Шелковистая текстура, охлаждение огня' },
        { name: 'Чиа-пудинг на кокосовом молоке', page: 'Стр. 102', note: 'Нежный саттвичный десерт' },
        { name: 'Салат «Свежесть»', page: 'Стр. 54', note: 'Сочные овощи и мята' }
      ]
    },
    kapha: {
      title: 'Ваша ведущая конституция: Капха (Земля и Вода)',
      desc: 'Вы спокойны, верны, обладаете крепким здоровьем и выносливостью. При дисбалансе наступает апатия, застой жидкости и тяжесть. Вам показана теплая, легкая пища, острые и горькие специи (имбирь, черный перец, пажитник) для стимуляции метаболизма.',
      dishes: [
        { name: 'Нежное Манго-Карри', page: 'Стр. 93', note: 'Пряный имбирь стимулирует Агни' },
        { name: 'Котлеты из маша и чечевицы', page: 'Стр. 87', note: 'Белок без утяжеления ЖКТ' },
        { name: 'Мятно-имбирный чай', page: 'Стр. 113', note: 'Очищение и разгон обмена веществ' }
      ]
    }
  };

  const current = doshaData[dosha];
  resultTitle.textContent = current.title;
  resultDesc.textContent = current.desc;

  dishesGrid.innerHTML = current.dishes.map(d => `
    <div class="result-dish-card">
      <strong>${d.name}</strong>
      <span>${d.page} • ${d.note}</span>
    </div>
  `).join('');

  resultBox.style.display = 'block';
}

function resetQuiz() {
  document.getElementById('quiz-result').style.display = 'none';
  document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
  document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
  currentQuizStep = 1;
  document.querySelector('.quiz-step[data-step="1"]').classList.add('active');
}

/* ========================================================
   4. МОДАЛЬНЫЕ ОКНА И КАРУСЕЛЬ КНИГИ
   ======================================================== */
const previewBookPages = [
  { src: 'assets/images/book_cover.jpg', caption: 'Обложка книги • «Пища с любовью от Рупавати»' },
  { src: 'assets/images/dish_page_20.jpg', caption: 'Стр. 20 • Завтраки: Пшённая каша с курагой' },
  { src: 'assets/images/dish_page_70.jpg', caption: 'Стр. 70 • Супы: Традиционный золотой суп Дал' },
  { src: 'assets/images/dish_page_80.jpg', caption: 'Стр. 80 • Основные блюда: Кутабы со свежей зеленью и сыром' },
  { src: 'assets/images/dish_page_93.jpg', caption: 'Стр. 93 • Основные блюда: Авторское Манго-Карри' },
  { src: 'assets/images/dish_page_100.jpg', caption: 'Стр. 100 • Десерты: Чизкейк с черносливом без яиц' },
  { src: 'assets/images/author_rupavati.jpg', caption: 'Стр. 114 • Благодарность от автора Рупавати' }
];

let currentPreviewIndex = 0;

function openPreviewModal() {
  document.getElementById('preview-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePreviewModal() {
  document.getElementById('preview-modal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

function setPreviewImageByIndex(index) {
  if (index < 0) index = previewBookPages.length - 1;
  if (index >= previewBookPages.length) index = 0;
  
  currentPreviewIndex = index;
  const item = previewBookPages[currentPreviewIndex];
  
  document.getElementById('preview-current-img').src = item.src;
  document.getElementById('preview-caption').textContent = item.caption;

  const thumbs = document.querySelectorAll('.thumb-btn');
  thumbs.forEach((btn, idx) => {
    btn.classList.toggle('active', idx === currentPreviewIndex);
  });
}

function nextPreviewPage() {
  setPreviewImageByIndex(currentPreviewIndex + 1);
}

function prevPreviewPage() {
  setPreviewImageByIndex(currentPreviewIndex - 1);
}

function setPreviewImage(src, caption) {
  const foundIndex = previewBookPages.findIndex(p => p.src === src);
  if (foundIndex !== -1) {
    setPreviewImageByIndex(foundIndex);
  } else {
    document.getElementById('preview-current-img').src = src;
    document.getElementById('preview-caption').textContent = caption;
  }
}

// Заглушка сервисов экосистемы
function openEcosystemModal(title, desc) {
  document.getElementById('eco-service-title').textContent = title;
  document.getElementById('eco-service-desc').textContent = desc;
  document.getElementById('ecosystem-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeEcosystemModal() {
  document.getElementById('ecosystem-modal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Оформление заказа
function openOrderModal(planName) {
  document.getElementById('order-plan-input').value = planName;
  document.getElementById('order-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  document.getElementById('order-modal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Закрытие при клике по фону
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    closePreviewModal();
    closeEcosystemModal();
    closeOrderModal();
  }
});

/* ========================================================
   5. ПОДДЕРЖКА КЛАВИАТУРЫ (ПЛАНШЕТ С КЛАВИАТУРОЙ / ДЕСКТОП)
   ======================================================== */
function initKeyboardSupport() {
  window.addEventListener('keydown', (e) => {
    // 1. Закрытие окон по Esc
    if (e.key === 'Escape') {
      closePreviewModal();
      closeEcosystemModal();
      closeOrderModal();
    }

    // 2. Листание страниц книги стрелками влево / вправо
    const previewModal = document.getElementById('preview-modal');
    if (previewModal && previewModal.classList.contains('active')) {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        nextPreviewPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevPreviewPage();
      }
    }

    // 3. Выбор ответов в тесте клавишами 1, 2, 3 и подтверждение Enter
    const activeQuizStep = document.querySelector('.quiz-step.active');
    if (activeQuizStep && !document.querySelector('.modal.active')) {
      const options = activeQuizStep.querySelectorAll('.quiz-option');
      if (e.key === '1' && options[0]) {
        options[0].querySelector('input').checked = true;
        options[0].click();
      } else if (e.key === '2' && options[1]) {
        options[1].querySelector('input').checked = true;
        options[1].click();
      } else if (e.key === '3' && options[2]) {
        options[2].querySelector('input').checked = true;
        options[2].click();
      } else if (e.key === 'Enter') {
        const nextBtn = activeQuizStep.querySelector('.next-btn');
        if (nextBtn) {
          nextBtn.click();
        } else {
          const submitBtn = activeQuizStep.querySelector('button[onclick*="calculateQuizResult"]');
          if (submitBtn) submitBtn.click();
        }
      }
    }
  });
}

/* ========================================================
   6. ОБРАБОТЧИКИ ФОРМ (ДЕМО / СБОР КОНТАКТОВ)
   ======================================================== */
function handleLeadMagnet(e) {
  e.preventDefault();
  alert('Благодарим! Ссылка на мини-гид «Аюрведическая аптечка специй + 3 рецепта» отправлена. Добро пожаловать в мир чистой пищи!');
  e.target.reset();
}

function handleWaitlist(e) {
  e.preventDefault();
  alert('Спасибо! Вы успешно внесены в лист ожидания. Рупавати лично оповестит вас о старте на специальных условиях.');
  closeEcosystemModal();
  e.target.reset();
}

function handleOrderSubmit(e) {
  e.preventDefault();
  alert('Демо-версия: Заказ зафиксирован! В рабочей версии здесь откроется защищенный платежный шлюз (PayPal / ПриватБанк / Monobank / Stripe для English Edition), и PDF сразу придет на почту.');
  closeOrderModal();
  e.target.reset();
}

/* ========================================================
   7. МОБИЛЬНОЕ МЕНЮ
   ======================================================== */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      const icon = menuBtn.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Закрытие при клике по любому пункту меню
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });

    // Закрытие при клике снаружи
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          const icon = menuBtn.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
          }
        }
      }
    });
  }
}


/* ========================================================
   8. ПЕРЕКЛЮЧЕНИЕ СПОСОБОВ ОПЛАТЫ И ДАНЫ (GUMROAD / ПРИВАТ / PAYPAL)
   ======================================================== */
function switchReqTab(tab) {
  const instantBtn = document.getElementById('tab-instant-btn');
  const privatBtn = document.getElementById('tab-privat-btn');
  const paypalBtn = document.getElementById('tab-paypal-btn');

  const instantPane = document.getElementById('pane-instant');
  const privatPane = document.getElementById('pane-privat');
  const paypalPane = document.getElementById('pane-paypal');
  const manualSection = document.getElementById('manual-verification-section');

  // Сброс классов активных кнопок и панелей
  [instantBtn, privatBtn, paypalBtn].forEach(b => b && b.classList.remove('active'));
  [instantPane, privatPane, paypalPane].forEach(p => p && p.classList.remove('active'));

  if (tab === 'instant') {
    if (instantBtn) instantBtn.classList.add('active');
    if (instantPane) instantPane.classList.add('active');
    // Для авто-выдачи ручная форма подтверждения не нужна
    if (manualSection) manualSection.style.display = 'none';
  } else if (tab === 'privat') {
    if (privatBtn) privatBtn.classList.add('active');
    if (privatPane) privatPane.classList.add('active');
    // Для ручного перевода показываем форму подтверждения/чек
    if (manualSection) manualSection.style.display = 'block';
  } else if (tab === 'paypal') {
    if (paypalBtn) paypalBtn.classList.add('active');
    if (paypalPane) paypalPane.classList.add('active');
    // Для ручного перевода показываем форму подтверждения/чек
    if (manualSection) manualSection.style.display = 'block';
  }
}

// Калькулятор Даны и пересчет ссылки PayPal.me
function setDonationAmount(amount) {
  const input = document.getElementById('paypal-amount-input');
  if (input) input.value = amount;
  handleDonationInput(amount);

  // Обновление подсветки чипов
  const chips = document.querySelectorAll('.donation-chip');
  chips.forEach(chip => {
    if (parseInt(chip.textContent) === parseInt(amount)) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

function handleDonationInput(val) {
  const amount = parseInt(val) || 15;
  const sumDisplay = document.getElementById('paypal-btn-sum');
  const btn = document.getElementById('paypal-me-btn');

  if (sumDisplay) sumDisplay.textContent = amount + ' €';
  if (btn) {
    btn.href = 'https://www.paypal.com/paypalme/yuligorb/' + amount + 'EUR';
  }
}

// Обработка отправки данных на сверку
function handleOrderVerification(e) {
  e.preventDefault();
  const email = document.getElementById('order-email').value;
  const sender = document.getElementById('order-sender').value;
  const time = document.getElementById('order-time').value;

  alert('Благодарим! Данные приняты на сверку:\n' +
        '• Email для книги: ' + email + '\n' +
        '• Отправитель: ' + sender + '\n' +
        (time ? '• Время/сумма: ' + time + '\n' : '') +
        '\nРупавати сверит поступление по банковской выписке и отправит PDF-книгу на ваш Email в течение 1–3 часов.');
  closeOrderModal();
  e.target.reset();
}

// Открытие модального окна с нужной вкладкой
openOrderModal = function(planName, type) {
  const modal = document.getElementById('order-modal');
  const title = document.getElementById('order-modal-title');
  if (title && planName) {
    title.textContent = planName;
  }
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (type === 'instant') {
    switchReqTab('instant');
  } else if (type === 'ua') {
    switchReqTab('privat');
  } else if (type === 'donate' || type === 'eu') {
    switchReqTab('paypal');
  } else {
    switchReqTab('instant');
  }
};

function copyToClipboard(text, msg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      alert(msg);
    }).catch(() => {
      fallbackCopy(text, msg);
    });
  } else {
    fallbackCopy(text, msg);
  }
}

function fallbackCopy(text, msg) {
  const input = document.createElement('textarea');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  alert(msg);
}

// ==========================================
// Защита реквизитов от спам-ботов и парсеров
// Реквизиты собираются динамически по клику пользователя
// ==========================================
const _secVault = {
  // Номер карты в разделенных фрагментах
  c: ['5363', '5421', '1167', '4579'],
  // Email в разделенных фрагментах
  e: ['yuli', 'gorb', 'gmail', 'com']
};

function getSecureCard(formatted = false) {
  return formatted ? _secVault.c.join(' ') : _secVault.c.join('');
}

function getSecureEmail() {
  return _secVault.e[0] + '.' + _secVault.e[1] + '@' + _secVault.e[2] + '.' + _secVault.e[3];
}

function copySecureData(type) {
  if (type === 'card') {
    const card = getSecureCard(false);
    copyToClipboard(card, 'Номер карты ПриватБанка скопирован!');
  } else if (type === 'paypal') {
    const email = getSecureEmail();
    copyToClipboard(email, 'PayPal email скопирован!');
  }
}

function revealSecureData(type) {
  if (type === 'card') {
    const el = document.getElementById('card-privat');
    const btn = document.getElementById('btn-reveal-card');
    if (el) {
      el.textContent = getSecureCard(true);
      el.style.letterSpacing = '1px';
    }
    if (btn) {
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Номер открыт';
      btn.disabled = true;
      btn.style.opacity = '0.7';
      btn.style.cursor = 'default';
    }
  } else if (type === 'paypal') {
    const el = document.getElementById('paypal-email');
    const btn = document.getElementById('btn-reveal-paypal');
    if (el) {
      el.textContent = getSecureEmail();
      el.style.letterSpacing = '0.5px';
    }
    if (btn) {
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Email открыт';
      btn.disabled = true;
      btn.style.opacity = '0.7';
      btn.style.cursor = 'default';
    }
  }
}

function openSecurePayPal() {
  const email = getSecureEmail();
  copyToClipboard(email, 'PayPal email скопирован в буфер обмена! Переходим на сайт PayPal...');
  window.open('https://www.paypal.com', '_blank');
}

function openSecureEmail() {
  const email = getSecureEmail();
  window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Книга «Пища с любовью»');
}

// ==========================================
// 3D-FLIP ПАСХАЛКА ДЛЯ КАРТОЧКИ АВТОРА (РАНДОМНЫЕ ФОТО)
// ==========================================
const backstageStories = [
  {
    img: 'assets/images/backstage_stockholm.jpg',
    tag: '<i class="fa-solid fa-compass"></i> Вдохновение в пути',
    title: 'Еда объединяет сердца',
    quote: '«Вдохновляемся старинными улочками и собираем лучшие вкусы и специи мира для книги!»',
    sub: 'Рупавати & Иван • Gamla Stan 🏛️'
  },
  {
    img: 'assets/images/backstage_3d.jpg',
    tag: '<i class="fa-solid fa-glasses"></i> 3D-Контроль качества',
    title: 'Кулинарный спецназ',
    quote: '«Смотрим на Аюрведу и специи в новом измерении! Все рецепты протестированы и одобрены на 100%.»',
    sub: 'Рупавати & Иван • Новое измерение вкуса 😎'
  },
  {
    img: 'assets/images/author_backstage.jpg',
    tag: '<i class="fa-solid fa-heart"></i> Команда с любовью',
    title: 'Главный дегустатор',
    quote: '«За каждым великим поваром стоит тот, кто с любовью моет кастрюли, дегустирует рецепты и верстает сайты!»',
    sub: 'Рупавати & Иван • Намаскар 🙏'
  }
];

// Предзагрузка фото бэкстейджа для мгновенного отображения без рывков
if (typeof window !== 'undefined') {
  backstageStories.forEach(s => {
    const pre = new Image();
    pre.src = s.img;
  });
}

let lastBackstageIdx = -1;

function pickRandomBackstage() {
  let newIdx;
  if (backstageStories.length <= 1) return backstageStories[0];
  do {
    newIdx = Math.floor(Math.random() * backstageStories.length);
  } while (newIdx === lastBackstageIdx);
  lastBackstageIdx = newIdx;
  return backstageStories[newIdx];
}

function updateBackstageContent() {
  const story = pickRandomBackstage();
  const imgEl = document.getElementById('backstage-img');
  const tagEl = document.getElementById('backstage-tag');
  const titleEl = document.getElementById('backstage-title');
  const quoteEl = document.getElementById('backstage-quote');
  const subEl = document.getElementById('backstage-sub');

  if (imgEl) imgEl.src = story.img;
  if (tagEl) tagEl.innerHTML = story.tag;
  if (titleEl) titleEl.textContent = story.title;
  if (quoteEl) quoteEl.textContent = story.quote;
  if (subEl) subEl.textContent = story.sub;
}

function toggleAuthorFlip() {
  const card = document.getElementById('author-flip-card');
  if (card) {
    const isFlippingToBack = !card.classList.contains('flipped');
    if (isFlippingToBack) {
      updateBackstageContent();
    }
    card.classList.toggle('flipped');
  }
}

// ==========================================
// СЛОВАРЬ ДЛЯ УКРАИНСКОГО ЯЗЫКА (UKR)
// ==========================================
const uaTranslations = {
  'О книге': 'Про книгу',
  'Кому подходит': 'Кому підходить',
  'Рецепты': 'Рецепти',
  'Тест на Доши': 'Тест на Доші',
  'Об авторе': 'Про авторку',
  'Реквизиты': 'Реквізити',
  'Получить книгу': 'Отримати книгу',
  'Аюрведа • Лакто-вегетарианство • Саттва': 'Аюрведа • Лакто-вегетаріанство • Сатва',
  'Еда как молитва,<br>приготовленная с любовью': 'Їжа як молитва,<br>приготована з любов\'ю',
  'страниц мудрости': 'сторінок мудрості',
  'авторских блюд': 'авторських страв',
  'лет опыта шефа': 'років досвіду шефа',
  'доши в балансе': 'доші в балансі',
  'Скачать книгу (RU / EN)': 'Завантажити книгу (RU / EN)',
  'Полистать страницы': 'Погортати сторінки',
  'Телеграм-канал автора: ежедневные рецепты, советы по специям и живое общение': 'Телеграм-канал авторки: щоденні рецепти, поради щодо спецій та живе спілкування',
  'Присоединиться →': 'Приєднатися →',
  'Доступна на RU и EN': 'Доступна RU та EN',
  'Нажмите, чтобы полистать': 'Натисніть, щоб погортати',
  'О кулинарной книге': 'Про кулінарну книгу',
  '114 страниц осознанности, вкуса и тепла': '114 сторінок усвідомленості, смаку та тепла',
  'Книга создана для тех, кто ищет вкус, здоровье и чистоту': 'Книга створена для тих, хто шукає смак, здоров\'я та чистоту',
  'Ищущим здоровье, легкость и исцеление ЖКТ': 'Шукачам здоров\'я, легкості та зцілення ШКТ',
  'Гурманам, кулинарам и заботливым семьям': 'Гурманам, кулінарам та турботливим сім\'ям',
  'Гастрономическое путешествие': 'Гастрономічна подорож',
  'Избранные рецепты из 114 страниц книги': 'Вибрані рецепти зі 114 сторінок книги',
  'Приобрести книгу': 'Придбати книгу & Донати',
  'Выберите удобный формат книги': 'Оберіть зручний формат книги'
};
