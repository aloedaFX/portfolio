const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const pageLoader = document.getElementById('pageLoader');
const backToTop = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const projectModal = document.getElementById('projectModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const revealItems = document.querySelectorAll('.reveal-up');

function closeMenu() {
  mainNav.classList.remove('open');
  navToggle.classList.remove('open');
}

navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  navToggle.classList.toggle('open');
});

window.addEventListener('load', () => {
  pageLoader.classList.add('hidden');
});

function smoothScroll(event) {
  const link = event.currentTarget;
  const targetId = link.getAttribute('href');

  if (targetId.startsWith('#')) {
    event.preventDefault();
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMenu();
    }
  }
}

navLinks.forEach((link) => {
  link.addEventListener('click', smoothScroll);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      const navLink = document.querySelector(`.main-nav a[href="#${id}"]`);

      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'));
        if (navLink) navLink.classList.add('active');
      }
    });
  },
  {
    threshold: 0.35,
  }
);

sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener('scroll', () => {
  if (window.scrollY > 600) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      const cardCategory = card.dataset.category;
      if (filter === 'all' || cardCategory === filter) {
        card.style.display = 'grid';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

function openProjectModal(details) {
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalTools = document.getElementById('modalTools');
  const modalCategory = document.getElementById('modalCategory');
  const modalPreview = document.querySelector('.modal-preview');

  modalTitle.textContent = details.title;
  modalDescription.textContent = details.description;
  modalTools.textContent = details.tools;
  modalCategory.textContent = details.categoryLabel;
  
  if (details.image) {
    modalPreview.style.backgroundImage = `url('${details.image}')`;
  } else {
    modalPreview.style.backgroundImage = `linear-gradient(180deg, rgba(0, 101, 37, 0.24), rgba(0, 0, 0, 0.5))`;
  }

  projectModal.classList.add('active');
  projectModal.setAttribute('aria-hidden', 'false');
}

function closeProjectModal() {
  projectModal.classList.remove('active');
  projectModal.setAttribute('aria-hidden', 'true');
}

const viewButtons = document.querySelectorAll('.view-project');
viewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.project-card');
    if (!card) return;
    openProjectModal({
      title: card.dataset.title,
      description: card.dataset.description,
      tools: card.dataset.tools,
      categoryLabel: card.dataset.categoryLabel,
      image: card.dataset.image,
    });
  });
});

modalClose.addEventListener('click', closeProjectModal);
modalBackdrop.addEventListener('click', closeProjectModal);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && projectModal.classList.contains('active')) {
    closeProjectModal();
  }
});

// Formspree endpoint: replace FORM_ID with your form ID from Formspree
const FORM_ENDPOINT = 'https://formspree.io/f/xykawbqk';

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formNote.textContent = 'Sending...';

  const formData = new FormData(contactForm);
  // ensure _replyto is set for reply-to header
  if (formData.get('email')) formData.set('_replyto', formData.get('email'));

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      formNote.textContent = 'Thanks — your message was sent. I will reply by email.';
      contactForm.reset();
      closeMenu();
    } else {
      const data = await res.json();
      formNote.textContent = data?.error || 'Submission failed. Please try again.';
    }
  } catch (err) {
    formNote.textContent = 'Network error. Please try again.';
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));
