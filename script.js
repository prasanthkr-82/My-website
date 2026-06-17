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

  const slides = Array.from(galleryImages).map((img, index) => ({
    thumb: img.src,
    large: img.dataset.large || img.src,
    alt: img.alt || `Gallery image ${index + 1}`,
  }));

  if (!slides.length) return;

  let activeIndex = 0;

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
  }

  function updateGallery() {
    document.querySelectorAll('.gallery-slide').forEach((slide, index) => {
      slide.classList.toggle('is-active', index === activeIndex);
    });

    document.querySelectorAll('.gallery-thumb').forEach((thumb, index) => {
      thumb.classList.toggle('is-active', index === activeIndex);
    });
  }

  function openGallery(index) {
    if (index < 0 || index >= slides.length) return;

    activeIndex = index;
    updateGallery();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeGallery() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showNextImage() {
    activeIndex = (activeIndex + 1) % slides.length;
    updateGallery();
  }

  function showPrevImage() {
    activeIndex = (activeIndex - 1 + slides.length) % slides.length;
    updateGallery();
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

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;

    if (event.key === 'Escape') closeGallery();
    if (event.key === 'ArrowRight') showNextImage();
    if (event.key === 'ArrowLeft') showPrevImage();
  });

  buildGallery();
}
