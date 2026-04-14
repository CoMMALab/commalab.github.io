window.HELP_IMPROVE_VIDEOJS = false;

function initOneResultsIframeCarousel(carousel) {
  var slides = Array.prototype.slice.call(carousel.querySelectorAll('.iframe-carousel-slide'));
  if (!slides.length) {
    return;
  }

  var prevBtn = carousel.querySelector('.iframe-carousel-arrow:first-child');
  var nextBtn = carousel.querySelector('.iframe-carousel-arrow:last-child');
  var fullscreenBtn = carousel.querySelector('.iframe-fullscreen-btn');

  var controlsBlock = carousel.nextElementSibling;
  var counter = null;
  var buttonsContainer = null;
  if (controlsBlock && controlsBlock.classList.contains('iframe-carousel-controls')) {
    counter = controlsBlock.querySelector('.iframe-carousel-counter');
    var maybeButtons = controlsBlock.nextElementSibling;
    if (maybeButtons && maybeButtons.classList.contains('iframe-carousel-buttons')) {
      buttonsContainer = maybeButtons;
    }
  }

  var buttons = [];
  var current = Math.max(0, slides.findIndex(function (slide) {
    return slide.classList.contains('is-active');
  }));
  var isAnimating = false;

  if (current < 0) {
    current = 0;
  }

  function getSlideLabel(slide, index) {
    var iframe = slide.querySelector('iframe');
    if (slide.dataset && slide.dataset.label) {
      return slide.dataset.label;
    }
    if (iframe && iframe.title) {
      return iframe.title.trim();
    }
    return 'Scene ' + (index + 1);
  }

  function updateUi() {
    slides.forEach(function (slide, index) {
      var active = index === current;
      var prev = index === ((current - 1 + slides.length) % slides.length);
      var next = index === ((current + 1) % slides.length);
      slide.classList.toggle('is-active', active);
      slide.classList.toggle('is-prev', prev && !active);
      slide.classList.toggle('is-next', next && !active);
      slide.classList.toggle('is-hidden', !active && !prev && !next);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');

      var video = slide.querySelector('video');
      if (video) {
        if (active) {
          var rate = parseFloat(video.getAttribute('data-playback-rate') || '1');
          if (Number.isFinite(rate) && rate > 0) {
            video.defaultPlaybackRate = rate;
            video.playbackRate = rate;
          }
          var playPromise = video.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () { });
          }
        } else {
          video.pause();
        }
      }
    });

    if (counter) {
      counter.textContent = (current + 1) + ' / ' + slides.length;
    }

    buttons.forEach(function (button, index) {
      button.classList.toggle('is-active', index === current);
      button.setAttribute('aria-pressed', index === current ? 'true' : 'false');
    });
  }

  function moveTo(targetIndex) {
    if (isAnimating) {
      return;
    }

    var next = (targetIndex + slides.length) % slides.length;
    if (next === current) {
      return;
    }

    current = next;
    isAnimating = true;
    updateUi();
    window.setTimeout(function () {
      isAnimating = false;
    }, 320);
  }

  function step(direction) {
    moveTo(current + direction);
  }

  if (buttonsContainer) {
    buttonsContainer.innerHTML = '';
    slides.forEach(function (slide, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'iframe-carousel-button';
      button.textContent = getSlideLabel(slide, index);
      button.setAttribute('aria-pressed', index === current ? 'true' : 'false');
      button.addEventListener('click', function () {
        moveTo(index);
      });
      buttonsContainer.appendChild(button);
      buttons.push(button);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      step(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      step(1);
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', function () {
      var activeSlide = slides[current];
      var fullscreenTarget = activeSlide ? activeSlide.querySelector('.results-iframe-wrapper') : null;
      if (!fullscreenTarget) {
        fullscreenTarget = activeSlide || carousel;
      }

      var requestFullscreen = fullscreenTarget.requestFullscreen || fullscreenTarget.webkitRequestFullscreen || fullscreenTarget.msRequestFullscreen;
      if (requestFullscreen) {
        requestFullscreen.call(fullscreenTarget);
      }
    });
  }

  updateUi();
}

function initResultsIframeCarousel() {
  var carousels = document.querySelectorAll('.iframe-carousel');
  carousels.forEach(function (carousel) {
    initOneResultsIframeCarousel(carousel);
  });
}

$(document).ready(function () {
  $(".navbar-burger").click(function () {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  var options = {
    slidesToScroll: 1,
    slidesToShow: 3,
    loop: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 3000,
  };

  var carousels = bulmaCarousel.attach('.carousel', options);

  for (var i = 0; i < carousels.length; i++) {
    carousels[i].on('before:show', state => {
      console.log(state);
    });
  }

  var element = document.querySelector('#my-element');
  if (element && element.bulmaCarousel) {
    element.bulmaCarousel.on('before-show', function (state) {
      console.log(state);
    });
  }

  initResultsIframeCarousel();

  bulmaSlider.attach();
});

document.addEventListener('DOMContentLoaded', () => {
  const zoomables = document.querySelectorAll('.zoom-container');
  const overlay = document.getElementById('zoomOverlay');
  if (!overlay) return;
  let currentZoom = null;

  zoomables.forEach(container => {
    container.addEventListener('click', e => {
      if (e.target.closest('input, button, select, a, textarea, .no-zoom')) return;

      if (currentZoom && currentZoom !== container) closeZoom(currentZoom);

      if (container.classList.contains('zoomed')) {
        closeZoom(container);
      } else {
        openZoom(container);
      }
    });
  });

  overlay.addEventListener('click', () => {
    if (currentZoom) closeZoom(currentZoom);
  });

  window.addEventListener('keydown', e => {
    const key = e.key || e.code || '';
    if ((key === 'Escape' || key === 'Esc') && currentZoom) {
      closeZoom(currentZoom);
    }
  }, true);

  function openZoom(el) {
    el.classList.add('zoomed');
    overlay.style.display = 'block';
    requestAnimationFrame(() => (overlay.style.opacity = '1'));
    currentZoom = el;
  }

  function closeZoom(el) {
    el.classList.remove('zoomed');
    overlay.style.opacity = '0';
    setTimeout(() => (overlay.style.display = 'none'), 300);
    currentZoom = null;
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const flow = document.querySelector('.flow');
  if (!flow) {
    return;
  }

  const steps = Array.from(flow.querySelectorAll('.step'));
  if (steps.length !== 4) {
    return;
  }

  flow.classList.add('is-all-active');
  steps.forEach((step) => {
    step.classList.remove('is-active');
  });
});