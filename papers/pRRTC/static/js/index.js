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


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
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
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
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

    bulmaSlider.attach();

})

function setInterpolationImage2(i) {
  var image = interp_images_2[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper-2').empty().append(image);
}

// zoom.js
document.addEventListener('DOMContentLoaded', () => {
  const zoomables = document.querySelectorAll('.zoom-container');
  const overlay = document.getElementById('zoomOverlay');
  let currentZoom = null;

  zoomables.forEach(container => {
    container.addEventListener('click', e => {
      if (e.target.closest('input, button, select, a, textarea, .no-zoom')) return;

      // Close previously zoomed item if another is clicked
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