// Photo series with left-right capabilities on click or keypress
const mainImages = document.querySelectorAll('.main-image');
let index = [0, 0];

// [ [ALBUM 1], [ALBUM 2] ]
// [[ [THUMBNAIL, LARGE IMG] ]
const imagesArray = [
  [['http://picsum.photos/900/500?random=1', 'http://picsum.photos/1000/550?random=1'], ['http://picsum.photos/900/500?random=2', 'http://picsum.photos/1000/550?random=2'], ['http://picsum.photos/900/500?random=3', 'http://picsum.photos/1000/550?random=3']],
  [['http://picsum.photos/900/500?random=1', 'http://picsum.photos/1000/550?random=1'], ['http://picsum.photos/900/500?random=1', 'http://picsum.photos/1000/550?random=1'], ['http://picsum.photos/900/500?random=1', 'http://picsum.photos/1000/550?random=1']]
];

function generateDots() {
  mainImages.forEach(elem => {
    const x = [...mainImages].indexOf(elem);
    const wrapper = elem.querySelector('.dot-wrapper');

    // Set first image to first in array
    elem.querySelector('.new-photo').setAttribute('src', imagesArray[x][index[x]]);

    // Create a dot for each image in the array
    for (let i = 0; i < imagesArray[x].length; i++) {
      const dot = document.createElement('li');
      dot.classList = 'dot';

      // Make first image 'active' highlight
      if (i == 0) {
        dot.classList.add('active');
      }

      wrapper.append(dot);
    }
  });
}

function indexChange(num, isIndex, elem) {
  //Find out index of element to decide which index number to increase
  const x = [...mainImages].indexOf(elem);
  const dots = elem.querySelector('.dot-wrapper');

  if (isIndex) {
    index[x] = num;
  } else {
    index[x] += num;

    if (index[x] < 0) {
      index[x] = imagesArray[x].length - 1;
    } else if (index[x] > imagesArray[x].length - 1) {
      index[x] = 0;
    }
  }

  // set old-photo to current src for smooth transition!
  elem.querySelector('.old-photo').src = elem.querySelector('.new-photo').src;

  const currentImage = imagesArray[x][index[x]];
  const image = elem.querySelector('.new-photo');

  const imageThumb = `${currentImage[0]}`;
  const imageLarge = `${currentImage[1]}`;

  image.classList.add('fadeout');

  setTimeout(function () {
    image.src = imageThumb;
    image.dataset.largesrc = imageLarge;

    [...dots.children].forEach(dot => {
      dot.classList.remove('active');
    });

    dots.children[index[x]].classList.add('active');

    image.classList.remove('fadeout');
  }, 500);
}

function photoSeries(elem) {
  const arrows = elem.querySelectorAll('.arrow');
  const dots = elem.querySelectorAll('.dot');

  // event listeners specific to each album
  arrows.forEach(arrow => {
    arrow.addEventListener('click', function (e) {
      if (this.classList.contains('left')) {
        indexChange(-1, false, this.parentElement);
      } else if (this.classList.contains('right')) {
        indexChange(1, false, this.parentElement);
      }
      pauseSlideshow();
    })
  });

  dots.forEach(dot => {
    dot.addEventListener('click', function (e) {
      const num = [...dots].indexOf(dot);
      indexChange(num, true, this.closest('.main-image'));
      pauseSlideshow();
    })
  });
}

function indexChangeByKeyboard(e) {
  const scrollPosTop = document.querySelector('.parallax').scrollTop;
  const scrollPosBot = document.querySelector('.parallax').offsetHeight + scrollPosTop;

  const fotosSection = document.querySelector('#fotos.anchor').parentElement;
  const fotosTop = fotosSection.offsetTop;
  const fotosHeight = fotosSection.offsetHeight;
  const fotosBot = fotosHeight + fotosTop;

  const processSection = document.querySelector('#process.anchor').parentElement;
  const processTop = processSection.offsetTop;
  const processHeight = processSection.offsetHeight;
  const processBot = processHeight + processTop;

  // console.log(fotosTop, fotosBot);
  // console.log(processTop, processBot);

  if (scrollPosBot >= fotosTop && scrollPosTop <= fotosBot) {
    switch (e.key) {
      case 'ArrowLeft':
        indexChange(-1, false, fotosSection.querySelector('.main-image'))
        break;
      case 'ArrowRight':
        indexChange(1, false, fotosSection.querySelector('.main-image'))
        break;
    }
  } else if (scrollPosBot >= processTop && scrollPosTop <= processBot) {
    switch (e.key) {
      case 'ArrowLeft':
        indexChange(-1, false, processSection.querySelector('.main-image'))
        break;
      case 'ArrowRight':
        indexChange(1, false, processSection.querySelector('.main-image'))
        break;
    }
  }

  pauseSlideshow();
}

// Light box
function lightbox(e) {
  if (!e.target.classList.contains('new-photo')) {
    return
  };

  const wrapper = document.querySelector('.lightbox');
  const image = document.querySelector('.lightbox-image');

  image.src = e.target.dataset.largesrc;

  wrapper.style.display = '';

  setTimeout(() => {
    wrapper.classList.remove('hidden');
  }, 200);
}

function lightboxExit(e) {
  const wrapper = document.querySelector('.lightbox');

  if (e.target.classList.contains('lightbox-image')) {
    return;
  }

  wrapper.classList.add('hidden');
  setTimeout(() => {
    wrapper.style.display = 'none';
  }, 200);
}

// Auto run slideshow
let slideshowDelay; // how many seconds before going to next photo?
let slideshowPaused;

function slideshow() {
  slideshowDelay = setInterval(
    function () {
      console.log('5 second!');
      indexChange(1, false, document.querySelector('#fotos.anchor').parentElement.querySelector('.main-image'))
      indexChange(1, false, document.querySelector('#process.anchor').parentElement.querySelector('.main-image'));
    }, 5000);
}

function pauseSlideshow() {
  console.log('Waiting 6 seconds!');
  clearInterval(slideshowDelay);
  clearTimeout(slideshowPaused);

  slideshowPaused = setTimeout(function () {
    console.log('Starting slideshow again.');
    slideshow();
  }, 6000);
}

// JS Parallax Version
let scrolled = 0;

function jsParallax() {
  scrolled = document.querySelector('.parallax').scrollTop;

  if (window.outerWidth < 640) {
    return;
  }

  // For hero image at top
  const lights = document.querySelector('._lights');
  const seats = document.querySelector('._seats');
  const wall = document.querySelector('._wall');
  const title = document.querySelector('._title');
  const bar = document.querySelector('._bar');

  let lightsTop = 10 + (scrolled * 0.08);
  lights.style.top = lightsTop + '%';

  let seatsTop = 69 + (scrolled * 0.01);
  seats.style.top = seatsTop + '%';

  let wallTop = 0 + (scrolled * 0.04);
  wall.style.top = wallTop + '%';

  let titleTop = 32 + (scrolled * 0.06);
  title.style.top = titleTop + '%';

  let barTop = 60 + (scrolled * 0.02);
  bar.style.top = barTop + '%';

  // For sections later down the page.

  /* Due to the depth of the elements, getting the exact distance from the top of the wrapper (dvs. the exact amount to scroll from top) is done by getting offsetTop (distance between top of el to top of parent) of the offsetParents and adding them together.

  This is used to offset the scroll effect so that elements that come later on in the page aren't WILDLY offbase, and must be done responsively due to different distances from top depending on window size. */

  const dots = document.querySelectorAll('.dotted-box');
  const framedBoxes = document.querySelectorAll('.framed-wrapper');

  dots.forEach(el => {
    let dotsScrolled = scrolled - (el.offsetTop +
      el.offsetParent.offsetTop +
    el.offsetParent.offsetParent.offsetParent.offsetTop);

    let dotsTop = -100 - (dotsScrolled * 0.1);
    el.style.top = dotsTop + 'px';
  });

  framedBoxes.forEach(el => {
    let frameScrolled = scrolled - (el.offsetTop +
      el.offsetParent.offsetTop +
      el.offsetParent.offsetParent.offsetTop);

    let framesTop = -100 - (frameScrolled * 0.2);
    el.style.top = framesTop + 'px';
  });
}


// Nav highlight
// Set active to the section in nav depending on scroll. First function is to create an array from all the current anchors on page and to add event listening to the scrolling div.
function setupAnchors() {
  const anchors = document.querySelectorAll('.anchor');
  const anchorsArray = [];

  anchors.forEach(anchor => {
    const pos = anchor.getBoundingClientRect().top;
    const elem = [...anchors].indexOf(anchor);
    const menuLink = document.querySelectorAll('.menu li')[elem];

    anchorsArray.push([menuLink, pos]);
  });

  console.log(anchorsArray);

  document.querySelector('.parallax').addEventListener('scroll', function (e) {
    navHighlight(anchorsArray);
  });
}

/* Uses array from previous function.
When the user has scrolled past the anchor by at least [random value] (this is finetuned to allow at least 1/4 of the section to be visible), the corresponding navigation link in the header will be 'active'. */
function navHighlight(anchorsArray) {
  let scrolledBot = (scrolled + document.querySelector('.parallax').offsetHeight) / 1.2;

  anchorsArray.forEach(currentItem => {
    currentItem[0].classList.remove('active');
  });

  if (scrolledBot < anchorsArray[1][1]) {
    anchorsArray[0][0].classList.add('active');
  } else if (scrolledBot < anchorsArray[2][1]) {
    anchorsArray[1][0].classList.add('active');
  } else if (scrolledBot < anchorsArray[3][1]) {
    anchorsArray[2][0].classList.add('active');
  } else if (scrolledBot < anchorsArray[4][1]) {
    anchorsArray[3][0].classList.add('active');
  } else if (scrolledBot < anchorsArray[5][1]) {
    anchorsArray[4][0].classList.add('active');
  } else if (scrolledBot < anchorsArray[6][1]) {
    anchorsArray[5][0].classList.add('active');
  } else {
    anchorsArray[6][0].classList.add('active');
  }
}

// Run all functions
generateDots();
mainImages.forEach(image => {
  photoSeries(image);
  image.addEventListener('click', lightbox);
});
setupAnchors();
window.addEventListener('keydown', function (e) {
  indexChangeByKeyboard(e);

  if (e.key == 'Escape') {
    lightboxExit(e);
  }
});
slideshow();
document.querySelector('.parallax').addEventListener('scroll', function (e) {
  jsParallax();
});
document.querySelector('.lightbox').addEventListener('click', lightboxExit);