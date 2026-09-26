/* =========================================================
   VeriMat Materials Testing Laboratory — Main Script
   Handles: mobile navigation, scroll reveal animations,
   contact form validation, and project gallery lightbox.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initScrollReveal();
  initContactForm();
  initGallery();
  initHeaderScrollShadow();
});

/* ---------------------------------------------------------
   Mobile navigation (hamburger menu)
--------------------------------------------------------- */
function initMobileNav() {
  var toggle = document.querySelector('.hamburger');
  var menu = document.querySelector('.mobile-nav');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('show');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close the mobile menu when a link is tapped
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('show');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on resize back to desktop width
  window.addEventListener('resize', function () {
    if (window.innerWidth > 720) {
      menu.classList.remove('show');
      toggle.classList.remove('open');
    }
  });
}

/* ---------------------------------------------------------
   Subtle header shadow / opacity change on scroll
--------------------------------------------------------- */
function initHeaderScrollShadow() {
  var header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ---------------------------------------------------------
   Scroll reveal animations (fade + slide up on view)
--------------------------------------------------------- */
function initScrollReveal() {
  var targets = document.querySelectorAll('.reveal, .card, .timeline-item');
  if (!('IntersectionObserver' in window) || targets.length === 0) {
    targets.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) { observer.observe(el); });
}

/* ---------------------------------------------------------
   Contact / Inquiry form validation
--------------------------------------------------------- */
function initContactForm() {
  var form = document.getElementById('inquiry-form');
  if (!form) return;

  var status = document.getElementById('form-status');

  var fields = {
    name: { el: form.querySelector('#name'), error: form.querySelector('#name-error') },
    email: { el: form.querySelector('#email'), error: form.querySelector('#email-error') },
    service: { el: form.querySelector('#service'), error: form.querySelector('#service-error') },
    message: { el: form.querySelector('#message'), error: form.querySelector('#message-error') }
  };

  function showError(field, message) {
    if (!field.el) return;
    field.el.classList.add('invalid');
    if (field.error) field.error.textContent = message;
  }

  function clearError(field) {
    if (!field.el) return;
    field.el.classList.remove('invalid');
    if (field.error) field.error.textContent = '';
  }

  function isValidEmail(value) {
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value);
  }

  function validateField(key) {
    var field = fields[key];
    if (!field || !field.el) return true;
    var value = field.el.value.trim();

    if (key === 'name') {
      if (value === '') { showError(field, 'Please enter your name.'); return false; }
    }
    if (key === 'email') {
      if (value === '') { showError(field, 'Please enter your email address.'); return false; }
      if (!isValidEmail(value)) { showError(field, 'Please enter a valid email address.'); return false; }
    }
    if (key === 'service') {
      if (value === '') { showError(field, 'Please select a service.'); return false; }
    }
    if (key === 'message') {
      if (value === '') { showError(field, 'Please enter a short message.'); return false; }
    }
    clearError(field);
    return true;
  }

  // live validation on blur
  Object.keys(fields).forEach(function (key) {
    var field = fields[key];
    if (field.el) {
      field.el.addEventListener('blur', function () { validateField(key); });
      field.el.addEventListener('input', function () {
        if (field.el.classList.contains('invalid')) validateField(key);
      });
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var validKeys = Object.keys(fields);
    var allValid = true;
    validKeys.forEach(function (key) {
      if (!validateField(key)) allValid = false;
    });

    if (!allValid) {
      if (status) {
        status.textContent = 'Please correct the highlighted fields before submitting.';
        status.className = 'form-status error';
      }
      return;
    }

    // No backend / email service is configured for this student project.
    // The form is validated client-side and a confirmation message is shown.
    if (status) {
      status.textContent = 'Thank you. Your inquiry has been prepared. (This is a student project demo — no email service is connected.)';
      status.className = 'form-status success';
    }
    form.reset();
  });
}

/* ---------------------------------------------------------
   Project gallery lightbox
--------------------------------------------------------- */
function initGallery() {
  var items = document.querySelectorAll('.gallery-item');
  var lightbox = document.getElementById('lightbox');
  if (items.length === 0 || !lightbox) return;

  var lightboxImg = lightbox.querySelector('img');
  var closeBtn = lightbox.querySelector('.lightbox-close');

  items.forEach(function (item) {
    item.addEventListener('click', function () {
      var img = item.querySelector('img');
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('show');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('show');
    lightboxImg.src = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
}
