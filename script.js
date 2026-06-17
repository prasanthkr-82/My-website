// Simple function for the Join button
function showAlert() {
  alert("Thank you for your interest! We will contact you soon.");
}

document.addEventListener('DOMContentLoaded', () => {
  console.log("My Website Loaded Successfully!");

  initContactForm();
  initGalleryPopup();
});

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const phoneInput = document.getElementById('userPhone');
  const messageInput = document.getElementById('userMessage');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const messageError = document.getElementById('messageError');

  if (!nameInput || !emailInput || !messageInput || !formStatus || !submitBtn) {
    console.warn('Contact form is missing required fields.');
    return;
  }

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const allErrors = [nameError, emailError, phoneError, messageError].filter(Boolean);
    allErrors.forEach((error) => (error.style.display = 'none'));
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    let isFormValid = true;

    if (nameInput.value.trim() === '') {
      if (nameError) nameError.style.display = 'block';
      isFormValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      if (emailError) emailError.style.display = 'block';
      isFormValid = false;
    }

    const phoneRegex = /^\d{10,}$/;
    if (phoneInput.value.trim() !== '' && !phoneRegex.test(phoneInput.value.trim())) {
      if (phoneError) phoneError.style.display = 'block';
      isFormValid = false;
    }

    if (messageInput.value.trim() === '') {
      if (messageError) messageError.style.display = 'block';
      isFormValid = false;
    }

    if (!isFormValid) return;

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      formStatus.textContent = 'Thank you! Your message has been sent successfully.';
      formStatus.classList.add('success');
      contactForm.reset();
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }, 2000);
  });
}

function initGalleryPopup() {
  const galleryImages = document.querySelectorAll('.gallery-item img');
  const modal = document.getElementById('galleryModal');
  const backdrop = document.getElementById('galleryBackdrop');
  const closeButton = document.getElementById('galleryClose');
  const track = document.getElementById('galleryTrack');
  const thumbs = document.getElementById('galleryThumbs');
  const prevButton = document.getElementById('sliderPrev');
  const nextButton = document.getElementById('sliderNext');

  if (!galleryImages.length || !modal || !backdrop || !closeButton || !track || !thumbs || !prevButton || !nextButton) {
    return;
  }

  const pageMain = document.querySelector('main') || document.body;

  const slides = Array.from(galleryImages).map((img, index) => ({
    thumb: img.src,
    large: img.dataset.large || img.src,
    alt: img.alt || `Gallery image ${index + 1}`,
  }));

  if (!slides.length) return;

  let activeIndex = 0;
  let previouslyFocused = null;

  function buildGallery() {
    track.innerHTML = slides
      .map(
        (slide, index) => `
          <div class="gallery-slide${index === 0 ? ' is-active' : ''}" data-index="${index}">
            <img src="${slide.large}" alt="${slide.alt}">
          </div>
        `
      )
      .join('');

    thumbs.innerHTML = slides
      .map(
        (slide, index) => `
          <img class="gallery-thumb${index === 0 ? ' is-active' : ''}"
               src="${slide.thumb}"
               data-index="${index}"
               alt="Thumbnail ${index + 1}">
        `
      )
      .join('');

    // Preload large images (deferred slightly to avoid blocking)
    setTimeout(() => {
      slides.forEach(s => {
        const img = new Image();
        img.src = s.large;
      });
    }, 300);
  }

  function updateGallery() {
    document.querySelectorAll('.gallery-slide').forEach((slide, index) => {
      slide.classList.toggle('is-active', index === activeIndex);
    });

    document.querySelectorAll('.gallery-thumb').forEach((thumb, index) => {
      thumb.classList.toggle('is-active', index === activeIndex);
    });
  }

  function trapFocus(e) {
    if (!modal.classList.contains('is-open')) return;
    const focusable = modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) { // shift + tab
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else { // tab
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  function openGallery(index) {
    if (index < 0 || index >= slides.length) return;

    previouslyFocused = document.activeElement;
    activeIndex = index;
    updateGallery();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    pageMain.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'hidden';
    // focus the close button for accessibility
    closeButton.focus();
    document.addEventListener('keydown', trapFocus);
  }

  function closeGallery() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    pageMain.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', trapFocus);
    if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
  }

  function showNextImage() {
    activeIndex = (activeIndex + 1) % slides.length;
    updateGallery();
  }

  function showPrevImage() {
    activeIndex = (activeIndex - 1 + slides.length) % slides.length;
    updateGallery();
  }

  // Swipe handling (pointer events)
  let startX = 0;
  let isPointerDown = false;

  function onPointerDown(e) {
    isPointerDown = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  }

  function onPointerMove(e) {
    if (!isPointerDown) return;
    // no-op for now; could implement drag preview
  }

  function onPointerUp(e) {
    if (!isPointerDown) return;
    const endX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
    const dx = endX - startX;
    const threshold = 50; // px
    if (dx < -threshold) showNextImage();
    if (dx > threshold) showPrevImage();
    isPointerDown = false;
  }

  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => openGallery(index));
  });

  backdrop.addEventListener('click', closeGallery);
  closeButton.addEventListener('click', closeGallery);
  nextButton.addEventListener('click', showNextImage);
  prevButton.addEventListener('click', showPrevImage);

  thumbs.addEventListener('click', (event) => {
    const thumb = event.target.closest('.gallery-thumb');
    if (!thumb) return;
    openGallery(Number(thumb.dataset.index));
  });

  // pointer/touch events for swipe gestures
  track.addEventListener('pointerdown', onPointerDown);
  track.addEventListener('pointermove', onPointerMove);
  track.addEventListener('pointerup', onPointerUp);
  track.addEventListener('pointercancel', () => { isPointerDown = false; });
  // fallback touch events
  track.addEventListener('touchstart', onPointerDown);
  track.addEventListener('touchmove', onPointerMove);
  track.addEventListener('touchend', onPointerUp);

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;

    if (event.key === 'Escape') closeGallery();
    if (event.key === 'ArrowRight') showNextImage();
    if (event.key === 'ArrowLeft') showPrevImage();
  });

  buildGallery();
}
