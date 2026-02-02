/*
  Main JavaScript - Theme toggle, scroll animations, navigation, contact form
*/

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollReveal();
  initFullPageScroll();
  initNavbar();
  initMobileMenu();
  initTypingEffect();
  initContactForm();
  initSmoothScroll();
});

// Theme toggle with localStorage persistence
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggle?.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  toggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
  toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

// Scroll reveal animations - fade in AND fade out based on visibility
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Fade in when entering viewport, fade out when leaving
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '-50px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// Full-page scroll - single scroll = full section navigation
function initFullPageScroll() {
  const sections = document.querySelectorAll('main > section');
  let isScrolling = false;
  let currentSectionIndex = 0;

  // Find current section based on scroll position
  function getCurrentSection() {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    let current = 0;

    sections.forEach((section, index) => {
      if (scrollPos >= section.offsetTop) {
        current = index;
      }
    });

    return current;
  }

  // Scroll to specific section
  function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;

    isScrolling = true;
    currentSectionIndex = index;

    sections[index].scrollIntoView({ behavior: 'smooth' });

    // Prevent rapid scrolling
    setTimeout(() => {
      isScrolling = false;
    }, 800);
  }

  // Handle wheel events for full-page scroll
  window.addEventListener('wheel', (e) => {
    if (isScrolling) {
      e.preventDefault();
      return;
    }

    currentSectionIndex = getCurrentSection();

    // Detect scroll direction
    if (e.deltaY > 30) {
      // Scrolling down
      e.preventDefault();
      scrollToSection(currentSectionIndex + 1);
    } else if (e.deltaY < -30) {
      // Scrolling up
      e.preventDefault();
      scrollToSection(currentSectionIndex - 1);
    }
  }, { passive: false });

  // Handle keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (isScrolling) return;

    currentSectionIndex = getCurrentSection();

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      scrollToSection(currentSectionIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      scrollToSection(currentSectionIndex - 1);
    }
  });
}

// Navbar scroll behavior
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Mobile menu toggle
function initMobileMenu() {
  const toggle = document.querySelector('.navbar__toggle');
  const menu = document.querySelector('.navbar__menu');

  toggle?.addEventListener('click', () => {
    menu?.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  // Close menu when clicking a link
  document.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      menu?.classList.remove('open');
      toggle?.classList.remove('active');
    });
  });
}

// Typing effect for hero subtitle
function initTypingEffect() {
  const element = document.querySelector('.hero__title-text');
  if (!element) return;

  const roles = [
    'Full-Stack Developer',
    'Python & Django',
    'React & Frontend',
    'AWS & DevOps',
    'AI & RAG Solutions'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      element.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      element.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before next role
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

// Contact form handling with EmailJS
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Validate
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all fields', 'error');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    // Add timestamp
    const timestamp = document.getElementById('timestamp');
    if (timestamp) {
      timestamp.value = new Date().toLocaleString();
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';

    try {
      await emailjs.sendForm('service_cngzocj', 'template_572wwaa', form);
      showToast('Message sent successfully!', 'success');
      form.reset();
    } catch (error) {
      showToast('Failed to send message. Please try again.', 'error');
      console.error('EmailJS error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

// Toast notification
function showToast(message, type = 'success') {
  // Remove any existing toasts
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success'
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

  toast.innerHTML = `${icon}<span>${message}</span>`;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
