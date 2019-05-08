/* Functions list
parallaxInChrome();

*/

// If user is on Chrome on Windows, use parallax CSS technique.
function parallaxInChrome() {
  const os = window.navigator.platform;
  const browser = navigator.userAgent;

  console.log(os, browser)

  if (os.match(/win/gi) && browser.match(/chrome/gi)) {
    document.querySelector('.parallax').classList.add('chromewindows');
  }
}

// Photo series with left-right capabilities on click or keypress
const mainImages = document.querySelectorAll('.main-image');
let index = [0, 0];

const imagesArray = [
  ['http://picsum.photos/900/500?random=1', 'http://picsum.photos/900/500?random=2', 'http://picsum.photos/900/500?random=3'],
  ['http://picsum.photos/900/500?random=4', 'http://picsum.photos/900/500?random=5', 'http://picsum.photos/900/500?random=6', 'http://picsum.photos/900/500?random=7']
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

  // const currentImage = `resources/${imagesArray[x][index[x]]}`;
  const currentImage = imagesArray[x][index[x]];
  const image = elem.querySelector('.new-photo');

  image.classList.add('fadeout');

  setTimeout(function() {
    image.src = currentImage;

    [...dots.children].forEach(dot => {
      dot.classList.remove('active');
    });

    dots.children[index[x]].classList.add('active');
  }, 300);

  setTimeout(function() {
    image.classList.remove('fadeout');
  }, 350);
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


// Auto run slideshow

let slideshowDelay; // how many seconds before going to next photo?
let slideshowPaused;
let isWaiting = false;

function slideshow() {
  slideshowDelay = setInterval(
    function () {
      console.log('5 second!');
      indexChange(1, false, document.querySelector('#fotos.anchor').parentElement.querySelector('.main-image'))
      indexChange(1, false, document.querySelector('#process.anchor').parentElement.querySelector('.main-image'));
    }, 2000);
}

function pauseSlideshow() {
  isWaiting = true;
  console.log('Waiting 6 seconds!');
  clearInterval(slideshowDelay);
  clearTimeout(slideshowPaused);

  slideshowPaused = setTimeout(function() {
    console.log('Starting slideshow again.');
    slideshow();
  }, 6000);
}

// Run all functions
generateDots();
parallaxInChrome();
mainImages.forEach(image => {
  photoSeries(image);
});
window.addEventListener('keydown', indexChangeByKeyboard);
slideshow();