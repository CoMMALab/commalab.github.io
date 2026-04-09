window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/tower_pics/";
var NUM_INTERP_FRAMES = 222;
var INTERP_BASE_2 = "./static/tetris_pics/";
var NUM_INTERP_FRAMES_2 = 121;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/frame_' + String(i + 1).padStart(4, '0') + '.png';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

var interp_images_2 = [];
function preloadInterpolationImages2() {
  for (var i = 0; i < NUM_INTERP_FRAMES_2; i++) {
    var path = INTERP_BASE_2 + '/frame_' + String(i + 30).padStart(4, '0') + '.png';
    interp_images_2[i] = new Image();
    interp_images_2[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}

function setInterpolationImage2(i) {
  var image = interp_images_2[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper-2').empty().append(image);
}

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
  var playPauseBtn = null;
  if (controlsBlock && controlsBlock.classList.contains('iframe-carousel-controls')) {
    counter = controlsBlock.querySelector('.iframe-carousel-counter');
    playPauseBtn = controlsBlock.querySelector('.iframe-playpause-btn');
    if (!playPauseBtn) {
      playPauseBtn = document.createElement('button');
      playPauseBtn.type = 'button';
      playPauseBtn.className = 'iframe-playpause-btn';
      playPauseBtn.textContent = 'Play/Pause';
      controlsBlock.appendChild(playPauseBtn);
    }
    var maybeButtons = controlsBlock.nextElementSibling;
    if (maybeButtons && maybeButtons.classList.contains('iframe-carousel-buttons')) {
      buttonsContainer = maybeButtons;
    }
  }

  var buttons = [];
  var current = Math.max(0, slides.findIndex(function(slide) {
    return slide.classList.contains('is-active');
  }));
  var isAnimating = false;

  if (current < 0) {
    current = 0;
  }

  function findToggleInTree(root) {
    if (!root || !root.querySelectorAll) {
      return null;
    }

    var pauseIcon = root.querySelector('svg.tabler-icon-player-pause-filled');
    if (pauseIcon) {
      var pauseBtn = pauseIcon.closest('button, [role="button"], .mantine-ActionIcon-root');
      if (pauseBtn) {
        return { element: pauseBtn, state: 'playing' };
      }
    }

    var playIcon = root.querySelector('svg.tabler-icon-player-play-filled');
    if (playIcon) {
      var playBtn = playIcon.closest('button, [role="button"], .mantine-ActionIcon-root');
      if (playBtn) {
        return { element: playBtn, state: 'paused' };
      }
    }

    var candidates = root.querySelectorAll('button, [role="button"], [aria-label], [title]');
    for (var i = 0; i < candidates.length; i++) {
      var node = candidates[i];
      var label = ((node.getAttribute('aria-label') || '') + ' ' + (node.getAttribute('title') || '') + ' ' + (node.textContent || '')).toLowerCase();
      if (label.includes('play') || label.includes('pause') || label.includes('toggle')) {
        return { element: node, state: 'unknown' };
      }
    }

    var all = root.querySelectorAll('*');
    for (var j = 0; j < all.length; j++) {
      var host = all[j];
      if (host.shadowRoot) {
        var nested = findToggleInTree(host.shadowRoot);
        if (nested) {
          return nested;
        }
      }
    }

    return null;
  }

  function autoPauseIframe(iframe) {
    var tries = 0;
    var maxTries = 24;

    function attemptPause() {
      tries += 1;
      var done = false;

      try {
        var doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
        if (doc) {
          var control = findToggleInTree(doc);
          if (control && control.element) {
            if (control.state === 'playing') {
              control.element.click();
            }
            done = true;
          }
        }
      } catch (e) {
        // Ignore and retry while viewer initializes.
      }

      if (!done && tries < maxTries) {
        window.setTimeout(attemptPause, 150);
      }
    }

    attemptPause();
  }

  function toggleActiveSlidePlayback() {
    var activeSlide = slides[current];
    var iframe = activeSlide ? activeSlide.querySelector('iframe') : null;
    if (!iframe) {
      return;
    }

    try {
      var doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
      if (doc) {
        var toggle = findToggleInTree(doc);
        if (toggle && toggle.element) {
          toggle.element.click();
          return;
        }
      }
    } catch (e) {
      // Cross-origin iframe access can fail; handled by keyboard fallback below.
    }

    try {
      if (iframe.contentWindow) {
        iframe.focus();

        var keydownSpace = new KeyboardEvent('keydown', {
          key: ' ',
          code: 'Space',
          keyCode: 32,
          which: 32,
          bubbles: true
        });
        var keyupSpace = new KeyboardEvent('keyup', {
          key: ' ',
          code: 'Space',
          keyCode: 32,
          which: 32,
          bubbles: true
        });

        var keydownK = new KeyboardEvent('keydown', {
          key: 'k',
          code: 'KeyK',
          keyCode: 75,
          which: 75,
          bubbles: true
        });
        var keyupK = new KeyboardEvent('keyup', {
          key: 'k',
          code: 'KeyK',
          keyCode: 75,
          which: 75,
          bubbles: true
        });

        iframe.contentWindow.dispatchEvent(keydownSpace);
        iframe.contentWindow.dispatchEvent(keyupSpace);
        iframe.contentWindow.dispatchEvent(keydownK);
        iframe.contentWindow.dispatchEvent(keyupK);

        if (iframe.contentDocument) {
          iframe.contentDocument.dispatchEvent(keydownSpace);
          iframe.contentDocument.dispatchEvent(keyupSpace);
          iframe.contentDocument.dispatchEvent(keydownK);
          iframe.contentDocument.dispatchEvent(keyupK);
        }

        iframe.contentWindow.postMessage({ type: 'toggle-play-pause' }, '*');
      }
    } catch (e) {
      // Final fallback intentionally no-op.
    }
  }

  slides.forEach(function(slide) {
    var iframe = slide.querySelector('iframe');
    if (!iframe) {
      return;
    }

    iframe.addEventListener('load', function() {
      autoPauseIframe(iframe);
    });

    // If already loaded by the time this runs, still try to pause.
    if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
      autoPauseIframe(iframe);
    }
  });

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
    slides.forEach(function(slide, index) {
      var active = index === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    if (counter) {
      counter.textContent = (current + 1) + ' / ' + slides.length;
    }

    buttons.forEach(function(button, index) {
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
    window.setTimeout(function() {
      isAnimating = false;
    }, 320);
  }

  function step(direction) {
    moveTo(current + direction);
  }

  if (buttonsContainer) {
    buttonsContainer.innerHTML = '';
    slides.forEach(function(slide, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'iframe-carousel-button';
      button.textContent = getSlideLabel(slide, index);
      button.setAttribute('aria-pressed', index === current ? 'true' : 'false');
      button.addEventListener('click', function() {
        moveTo(index);
      });
      buttonsContainer.appendChild(button);
      buttons.push(button);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      step(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      step(1);
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', function() {
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

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', function() {
      toggleActiveSlidePlayback();
    });
  }

  updateUi();
}

function initResultsIframeCarousel() {
  var carousels = document.querySelectorAll('.iframe-carousel');
  carousels.forEach(function(carousel) {
    initOneResultsIframeCarousel(carousel);
  });
}

$(document).ready(function() {
  $(".navbar-burger").click(function() {
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
	  element.bulmaCarousel.on('before-show', function(state) {
	  	console.log(state);
	  });
  }

  preloadInterpolationImages();
  preloadInterpolationImages2();

  $('#interpolation-slider').on('input', function(event) {
    setInterpolationImage(this.value);
  });
  setInterpolationImage(0);
  $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

  $('#interpolation-slider-2').on('input', function(event) {
    setInterpolationImage2(this.value);
  });
  setInterpolationImage2(0);
  $('#interpolation-slider-2').prop('max', NUM_INTERP_FRAMES_2 - 1);

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