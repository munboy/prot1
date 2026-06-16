document.addEventListener('DOMContentLoaded', () => {
  /* --- INITIALIZE LOCAL STORAGE DEFAULTS --- */
  const defaultContacts = {
    phone1: '+38 (099) 051-29-65',
    phone2: '+38 (097) 651-85-51',
    email: 'soldatnikova@gmail.com',
    address: 'м. Дніпро, вул. І. Акінфієва, 18, офіс 301'
  };

  const defaultPages = {
    home_hero_title: "Кадрове агентство «Кар'єра»",
    home_hero_desc: "Професійний підбір персоналу для вашого бізнесу. 20 років успішного досвіду та тисячі працевлаштованих фахівців у Дніпрі та по всій Україні.",
    about_title: "Про кадрове агентство",
    about_mission: "Наша місія — допомагати бізнесу знаходити кращих фахівців, а кандидатам — будувати успішну кар'єру. Ми об'єднуємо професіоналів та створюємо можливості для розвитку."
  };

  const defaultVacancies = [
    {
      title: 'Senior DevOps Engineer',
      category: 'it',
      salary: '120 000 — 150 000 грн',
      city: 'Дніпро / Віддалено',
      experience: '4+ роки',
      type: 'Повна зайнятість',
      description: "Шукаємо досвідченого DevOps інженера для оптимізації та підтримки хмарної інфраструктури (AWS/Kubernetes) великого продуктового сервісу. Досвід від 4 років."
    },
    {
      title: "Керівник відділу продажів (B2B)",
      category: 'sales',
      salary: '45 000 — 60 000 грн + %',
      city: 'Дніпро',
      experience: '2+ роки',
      type: 'Повна зайнятість',
      description: "Запрошуємо фахівця для побудови та оптимізації процесів продажів у великій дистриб'юторській компанії (промислова сировина). Досвід управління відділом від 2 років."
    },
    {
      title: 'Головний інженер виробництва',
      category: 'production',
      salary: '50 000 — 70 000 грн',
      city: 'Дніпро (лівий берег)',
      experience: '5+ років',
      type: 'Повна зайнятість',
      description: 'Управління виробничим цехом металоконструкцій, планування завантаження обладнання, оптимізація витрат та контроль якості продукції. Профільна освіта.'
    },
    {
      title: 'CEO / Директор виробничої компанії',
      category: 'management',
      salary: 'За домовленістю',
      city: 'Дніпро',
      experience: '5+ років',
      type: 'Повна зайнятість',
      description: 'Стратегічне управління великим виробничим підприємством, розширення ринків збуту (у тому числі експорт), модернізація потужностей.'
    },
    {
      title: 'Фінансовий аналітик',
      category: 'finance',
      salary: '40 000 — 50 000 грн',
      city: 'Дніпро (центр)',
      experience: '3+ роки',
      type: 'Повна зайнятість',
      description: 'Фінансове планування, аналіз рентабельності проектів, підготовка управлінської звітності для акціонерів. Досвід роботи в інвестиційних проектах буде перевагою.'
    }
  ];

  // Initialize helper functions
  const initLocalStorage = () => {
    if (!localStorage.getItem('kar_contacts_v2')) {
      localStorage.setItem('kar_contacts_v2', JSON.stringify(defaultContacts));
    }
    if (!localStorage.getItem('kar_pages')) {
      localStorage.setItem('kar_pages', JSON.stringify(defaultPages));
    }
    if (!localStorage.getItem('kar_vacancies')) {
      localStorage.setItem('kar_vacancies', JSON.stringify(defaultVacancies));
    }
  };

  initLocalStorage();

  const getContacts = () => JSON.parse(localStorage.getItem('kar_contacts_v2'));
  const getPages = () => JSON.parse(localStorage.getItem('kar_pages'));
  const getVacancies = () => JSON.parse(localStorage.getItem('kar_vacancies'));

  /* --- DYNAMICALLY REPLACE CONTACTS ACROSS ALL PAGES --- */
  const applyContactsGlobally = () => {
    const contacts = getContacts();
    
    // Replace telephone links and text
    const telElements = document.querySelectorAll('a[href^="tel:"]');
    telElements.forEach((el, index) => {
      const href = el.getAttribute('href') || '';
      const text = el.textContent || '';
      // Support matching old phones as well as new ones
      if (href.includes('38056') || href.includes('7403301') || href.includes('6518551') || text.includes('740-33-01') || text.includes('651-85-51') || index === 1) {
        el.setAttribute('href', `tel:${contacts.phone2.replace(/\D/g, '')}`);
        el.textContent = contacts.phone2;
      } else {
        el.setAttribute('href', `tel:${contacts.phone1.replace(/\D/g, '')}`);
        el.textContent = contacts.phone1;
      }
    });

    // Replace mailto links and text
    const mailElements = document.querySelectorAll('a[href^="mailto:"]');
    mailElements.forEach(el => {
      el.setAttribute('href', `mailto:${contacts.email}`);
      el.textContent = contacts.email;
    });

    // Replace address elements
    const addressElements = document.querySelectorAll('.footer span, .footer-contact-item span, .contact-item-detail p');
    addressElements.forEach(el => {
      if (el.textContent.includes('Акінфієва') || el.textContent.includes('Україна')) {
        // preserve line break formatting if it's footer
        if (el.tagName === 'SPAN' && el.innerHTML.includes('<br>')) {
          const parts = contacts.address.split(', ');
          el.innerHTML = `${parts[0]}, ${parts[1]},<br>${parts.slice(2).join(', ')}`;
        } else {
          el.textContent = contacts.address;
        }
      }
    });

    // Specific contacts page text replacement
    const contactTexts = document.querySelectorAll('.contact-info-block p');
    contactTexts.forEach(el => {
      if (el.textContent.includes('Акінфієва') || el.textContent.includes('офіс')) {
        el.textContent = contacts.address;
      }
    });
  };

  applyContactsGlobally();

  /* --- DYNAMICALLY REPLACE PAGE CONTENT --- */
  const applyPageContent = () => {
    const pages = getPages();
    
    // index.html elements
    const homeHeroTitle = document.querySelector('.hero:not(.hero-alt) .hero-title');
    const homeHeroDesc = document.querySelector('.hero:not(.hero-alt) .hero-desc');
    if (homeHeroTitle && homeHeroDesc && window.location.pathname.includes('index.html')) {
      homeHeroTitle.textContent = pages.home_hero_title;
      homeHeroDesc.textContent = pages.home_hero_desc;
    }

    // about.html elements
    const aboutTitle = document.querySelector('.hero-alt .hero-title');
    const aboutMission = document.querySelector('.section .about-mission-text'); // We can add this class or find by content
    
    if (aboutTitle && window.location.pathname.includes('about.html')) {
      aboutTitle.textContent = pages.about_title;
    }
    
    // Find mission text paragraph in about.html
    const paragraphs = document.querySelectorAll('.section p');
    paragraphs.forEach(p => {
      if (p.textContent.includes('допомагати бізнесу знаходити') || p.textContent.includes('Наша місія')) {
        p.textContent = pages.about_mission;
      }
    });
  };

  applyPageContent();

  /* --- RENDER VACANCIES ON CATALOG PAGE --- */
  const renderVacanciesCatalog = () => {
    const vacancyGrid = document.getElementById('vacancy-grid');
    if (!vacancyGrid) return;

    // Clear existing cards
    vacancyGrid.innerHTML = '';
    const vacancies = getVacancies();

    const getCategoryBadgeLabel = (cat) => {
      switch(cat) {
        case 'it': return 'IT-Сфера';
        case 'sales': return 'Продажі';
        case 'production': return 'Виробництво';
        case 'management': return 'Менеджмент';
        case 'finance': return 'Фінанси';
        default: return 'Вакансія';
      }
    };

    vacancies.forEach((vac, index) => {
      const card = document.createElement('div');
      card.className = 'card card-vacancy vacancy-card-item reveal active';
      card.setAttribute('data-category', vac.category);
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
      card.style.transitionDelay = `${index * 0.05}s`;

      card.innerHTML = `
        <span class="vacancy-badge">${getCategoryBadgeLabel(vac.category)}</span>
        <h3 class="card-title" style="margin-top: 0.5rem; margin-bottom: 0.5rem;">${vac.title}</h3>
        <div class="vacancy-salary">${vac.salary}</div>
        <div class="vacancy-meta">
          <span class="vacancy-meta-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg>
            ${vac.city}
          </span>
          <span class="vacancy-meta-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            ${vac.type}
          </span>
        </div>
        <p class="card-text">${vac.description}</p>
        <div style="margin-top: 1.5rem;">
          <a href="resume.html?vacancy=${encodeURIComponent(vac.title)}" class="btn btn-primary">Відгукнутися</a>
        </div>
      `;
      vacancyGrid.appendChild(card);
    });
  };

  renderVacanciesCatalog();

  /* --- STICKY HEADER --- */
  const header = document.querySelector('.header');
  const handleScroll = () => {
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  /* --- MOBILE MENU --- */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('is-active');
      mobileNav.classList.toggle('is-open');
      document.body.style.overflow = mobileNav.classList.contains('is-open') ? 'hidden' : '';
    });

    const mobileLinks = mobileNav.querySelectorAll('.nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-active');
        mobileNav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- ACCORDIONS --- */
  const accordions = document.querySelectorAll('.accordion-header');
  accordions.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = header.nextElementSibling;
      const isActive = item.classList.contains('is-active');
      
      const parent = item.parentElement;
      const siblings = parent.querySelectorAll('.accordion-item');
      siblings.forEach(sib => {
        sib.classList.remove('is-active');
        const sibContent = sib.querySelector('.accordion-content');
        if (sibContent) sibContent.style.maxHeight = null;
      });
      
      if (!isActive) {
        item.classList.add('is-active');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        item.classList.remove('is-active');
        content.style.maxHeight = null;
      }
    });
  });

  /* --- VACANCY FILTER ACTION --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const vacancyCards = document.querySelectorAll('.vacancy-card-item');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const filterValue = btn.getAttribute('data-filter');
        const cards = document.querySelectorAll('.vacancy-card-item');

        cards.forEach(card => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
              card.style.display = 'block';
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, 50);
            } else {
              card.style.display = 'none';
            }
          }, 200);
        });
      });
    });
  }

  /* --- DYNAMIC RESUME PREFILL --- */
  const urlParams = new URLSearchParams(window.location.search);
  const vacancyPrefill = urlParams.get('vacancy');
  const positionInput = document.getElementById('resume-position');
  if (vacancyPrefill && positionInput) {
    positionInput.value = vacancyPrefill;
  }

  /* --- MODALS SUBMISSION --- */
  const injectModal = () => {
    if (document.getElementById('success-modal')) return;
    const modalHtml = `
      <div class="modal" id="success-modal">
        <div class="modal-content">
          <div class="modal-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 6L9 17L4 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="modal-title" style="font-family: var(--font-serif); font-size: 1.75rem; color: var(--color-primary); margin-bottom: 0.75rem;">Дякуємо за звернення!</h2>
          <p class="modal-text" style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 2rem;">Вашу заявку успішно надіслано на нашу електронну пошту! Наш менеджер зв'яжеться з вами найближчим часом для обговорення деталей.</p>
          <button class="btn btn-primary modal-close-btn" style="width: 100%;">Закрити</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  };
  
  injectModal();

  const successModal = document.getElementById('success-modal');
  const showModal = (title, message) => {
    if (successModal) {
      if (title) successModal.querySelector('.modal-title').textContent = title;
      if (message) successModal.querySelector('.modal-text').textContent = message;
      successModal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (successModal) {
      successModal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  };

  if (successModal) {
    const modalCloseBtn = successModal.querySelector('.modal-close-btn');
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) closeModal();
    });
  }

  // Handle all form submissions on customer-facing pages
  const forms = document.querySelectorAll('form:not([id^="admin-"])');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const requiredInputs = form.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'red';
          setTimeout(() => { input.style.borderColor = ''; }, 3000);
        }
      });

      if (isValid) {
        showModal(
          "Дякуємо за звернення!",
          "Вашу заявку успішно надіслано на нашу електронну пошту! Наш менеджер зв'яжеться з вами найближчим часом для обговорення деталей."
        );
        form.reset();
      }
    });
  });

  /* --- DRAG AND DROP FILE MOCK --- */
  const dropZone = document.querySelector('.file-upload');
  const fileInput = document.getElementById('resume-file');
  
  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        updateDropZoneText(fileInput.files[0].name);
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--color-accent)';
        dropZone.style.backgroundColor = 'rgba(232, 124, 63, 0.05)';
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '';
        dropZone.style.backgroundColor = '';
      }, false);
    });

    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        fileInput.files = files;
        updateDropZoneText(files[0].name);
      }
    });

    const updateDropZoneText = (filename) => {
      const textEl = dropZone.querySelector('.file-upload-text');
      if (textEl) {
        textEl.innerHTML = `Файл обрано: <strong style="color: var(--color-accent);">${filename}</strong>`;
      }
    };
  }

  /* --- INTERACTIVE ADMIN PANEL CODE --- */
  if (window.location.pathname.includes('admin.html')) {
    // 1. Tab Switching
    const tabLinks = document.querySelectorAll('#admin-nav-tabs .admin-nav-item[data-tab]');
    const tabPanels = document.querySelectorAll('.admin-tab-content');

    tabLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = link.getAttribute('data-tab');

        // Toggle nav items
        tabLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Toggle content panels
        tabPanels.forEach(panel => {
          panel.classList.remove('active');
          if (panel.id === `tab-${tabId}`) {
            panel.classList.add('active');
          }
        });
      });
    });

    // 2. Load Contacts form fields
    const contactForm = document.getElementById('admin-contacts-form');
    if (contactForm) {
      const contacts = getContacts();
      document.getElementById('contact-phone-1').value = contacts.phone1;
      document.getElementById('contact-phone-2').value = contacts.phone2;
      document.getElementById('contact-email').value = contacts.email;
      document.getElementById('contact-address').value = contacts.address;

      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updated = {
          phone1: document.getElementById('contact-phone-1').value.trim(),
          phone2: document.getElementById('contact-phone-2').value.trim(),
          email: document.getElementById('contact-email').value.trim(),
          address: document.getElementById('contact-address').value.trim()
        };
        localStorage.setItem('kar_contacts_v2', JSON.stringify(updated));
        applyContactsGlobally();
        showModal("Дані збережено!", "Контактна інформація успішно оновлена та змінена на всіх сторінках сайту.");
      });
    }

    // 3. Load Pages form fields
    const pagesForm = document.getElementById('admin-pages-form');
    if (pagesForm) {
      const pages = getPages();
      document.getElementById('page-home-hero-title').value = pages.home_hero_title;
      document.getElementById('page-home-hero-desc').value = pages.home_hero_desc;
      document.getElementById('page-about-title').value = pages.about_title;
      document.getElementById('page-about-mission').value = pages.about_mission;

      pagesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updated = {
          home_hero_title: document.getElementById('page-home-hero-title').value.trim(),
          home_hero_desc: document.getElementById('page-home-hero-desc').value.trim(),
          about_title: document.getElementById('page-about-title').value.trim(),
          about_mission: document.getElementById('page-about-mission').value.trim()
        };
        localStorage.setItem('kar_pages', JSON.stringify(updated));
        applyPageContent();
        showModal("Контент оновлено!", "Тексти сторінок успішно змінено. Перейдіть на сайт для перегляду змін.");
      });
    }

    // 4. Vacancy Creator and Manager
    const vacancyForm = document.getElementById('admin-vacancy-form');
    const vacanciesList = document.getElementById('admin-vacancies-list');
    const vacanciesCounter = document.getElementById('vacancies-list-counter');
    const statsVacanciesCount = document.getElementById('stats-vacancies-count');

    const getCategoryLabel = (cat) => {
      switch(cat) {
        case 'it': return 'IT & Технології';
        case 'sales': return 'Продажі & Маркетинг';
        case 'production': return 'Виробництво & Інженерія';
        case 'management': return 'ТОП-менеджмент';
        case 'finance': return 'Фінанси & Облік';
        default: return 'Інше';
      }
    };

    const renderAdminVacancies = () => {
      if (!vacanciesList) return;
      const vacancies = getVacancies();
      vacanciesList.innerHTML = '';
      
      if (vacanciesCounter) vacanciesCounter.textContent = `Усього вакансій: ${vacancies.length}`;
      if (statsVacanciesCount) statsVacanciesCount.textContent = vacancies.length;

      vacancies.forEach((vac, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${vac.title}</strong></td>
          <td><span class="admin-badge admin-badge-active" style="background-color: rgba(37, 99, 235, 0.1); color: #2563EB;">${getCategoryLabel(vac.category)}</span></td>
          <td>${vac.salary}</td>
          <td>${vac.city} / ${vac.experience}</td>
          <td>
            <button class="btn btn-secondary btn-edit-vac" data-index="${index}" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; text-transform: none; margin-right: 0.5rem;">Редагувати</button>
            <button class="btn btn-primary btn-delete-vac" data-index="${index}" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; text-transform: none; background-color: #DC2626;">Видалити</button>
          </td>
        `;
        vacanciesList.appendChild(tr);
      });

      // Attach delete handlers
      const deleteButtons = vacanciesList.querySelectorAll('.btn-delete-vac');
      deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.getAttribute('data-index'));
          const vacancies = getVacancies();
          const deletedTitle = vacancies[index].title;
          vacancies.splice(index, 1);
          localStorage.setItem('kar_vacancies', JSON.stringify(vacancies));
          renderAdminVacancies();
          showModal("Вакансію видалено", `Вакансію «${deletedTitle}» успішно видалено з сайту.`);
        });
      });

      // Attach edit handlers
      const editButtons = vacanciesList.querySelectorAll('.btn-edit-vac');
      editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.getAttribute('data-index'));
          const vacancies = getVacancies();
          const vac = vacancies[index];

          // Fill form
          document.getElementById('vac-index').value = index;
          document.getElementById('vac-title').value = vac.title;
          document.getElementById('vac-category').value = vac.category;
          document.getElementById('vac-salary').value = vac.salary;
          document.getElementById('vac-city').value = vac.city;
          document.getElementById('vac-experience').value = vac.experience;
          document.getElementById('vac-type').value = vac.type;
          document.getElementById('vac-description').value = vac.description;

          // Scroll to form and update buttons
          document.getElementById('admin-vacancy-form').scrollIntoView({ behavior: 'smooth' });
          document.getElementById('vac-submit-btn').textContent = "Оновити вакансію";
          document.getElementById('vac-cancel-btn').style.display = 'inline-flex';
        });
      });
    };

    if (vacancyForm) {
      renderAdminVacancies();

      const cancelBtn = document.getElementById('vac-cancel-btn');
      const resetVacancyForm = () => {
        vacancyForm.reset();
        document.getElementById('vac-index').value = '';
        document.getElementById('vac-submit-btn').textContent = "Опублікувати вакансію";
        if (cancelBtn) cancelBtn.style.display = 'none';
      };

      if (cancelBtn) {
        cancelBtn.addEventListener('click', resetVacancyForm);
      }

      vacancyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const vacancies = getVacancies();
        const editIndexStr = document.getElementById('vac-index').value;

        const vacancyData = {
          title: document.getElementById('vac-title').value.trim(),
          category: document.getElementById('vac-category').value,
          salary: document.getElementById('vac-salary').value.trim(),
          city: document.getElementById('vac-city').value.trim(),
          experience: document.getElementById('vac-experience').value.trim(),
          type: document.getElementById('vac-type').value.trim(),
          description: document.getElementById('vac-description').value.trim()
        };

        if (editIndexStr !== '') {
          // Edit existing
          const index = parseInt(editIndexStr);
          vacancies[index] = vacancyData;
          localStorage.setItem('kar_vacancies', JSON.stringify(vacancies));
          showModal("Вакансію оновлено!", `Зміни у вакансії «${vacancyData.title}» успішно опубліковано на сайті.`);
        } else {
          // Add new
          vacancies.unshift(vacancyData);
          localStorage.setItem('kar_vacancies', JSON.stringify(vacancies));
          showModal("Вакансію опубліковано!", `Нова вакансія «${vacancyData.title}» успішно додана та з'явилася у каталозі.`);
        }

        renderAdminVacancies();
        resetVacancyForm();
      });
    }
  }

  /* --- SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER) --- */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -30px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* --- COLLAPSIBLE PARTNERS GRID TOGGLE --- */
  const togglePartnersBtn = document.getElementById('toggle-partners-btn');
  const partnersCollapse = document.getElementById('all-partners-grid');
  if (togglePartnersBtn && partnersCollapse) {
    togglePartnersBtn.addEventListener('click', () => {
      const isOpen = partnersCollapse.classList.contains('is-open');
      if (isOpen) {
        partnersCollapse.style.maxHeight = null;
        partnersCollapse.classList.remove('is-open');
        togglePartnersBtn.textContent = 'Показати всіх партнерів';
        // Scroll back up to the partners section header
        const partnersSection = document.getElementById('partners-section');
        if (partnersSection) {
          partnersSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        partnersCollapse.classList.add('is-open');
        partnersCollapse.style.maxHeight = partnersCollapse.scrollHeight + 'px';
        togglePartnersBtn.textContent = 'Приховати';
      }
    });
  }
});


