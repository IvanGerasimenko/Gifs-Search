document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  searchInput.value = 'Welcome';

  searchGifs();
});

const apiKey = 'BIDZ83IwtzntGDCRNKNxuqt8pr0iIIBD';
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
searchClear.addEventListener('click', () => {
  searchInput.value = '';
});

let offset = 0;
let currentSearch = '';

function openFullscreen(imageSrc) {
  const fullscreenContainer = document.createElement('div');
  fullscreenContainer.className = 'fullscreen-container';

  const fullscreenImg = document.createElement('img');
  fullscreenImg.src = imageSrc;
  fullscreenImg.setAttribute('data-index', 0);

  const prevButton = document.createElement('button');
  prevButton.innerHTML = '&#10094;';
  prevButton.className = 'prev-button';

  const nextButton = document.createElement('button');
  nextButton.innerHTML = '&#10095;';
  nextButton.className = 'next-button';

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.className = 'close-button';

  fullscreenContainer.appendChild(prevButton);
  fullscreenContainer.appendChild(fullscreenImg);
  fullscreenContainer.appendChild(nextButton);
  fullscreenContainer.appendChild(closeButton);
  document.body.appendChild(fullscreenContainer);

  const gifItems = Array.from(document.querySelectorAll('.gif-item'));
  let currentIndex = gifItems.findIndex((item) => item.querySelector('img').src === imageSrc);

  const navigateFullscreen = (direction) => {
    currentIndex += direction;

    if (currentIndex < 0) {
      currentIndex = gifItems.length - 1;
    } else if (currentIndex >= gifItems.length) {
      currentIndex = 0;
    }

    const img = gifItems[currentIndex].querySelector('img');
    fullscreenImg.src = img.src;
    fullscreenImg.setAttribute('data-index', currentIndex);
  };

  prevButton.addEventListener('click', () => {
    navigateFullscreen(-1);
  });

  nextButton.addEventListener('click', () => {
    navigateFullscreen(1);
  });

  closeButton.addEventListener('click', () => {
    document.body.removeChild(fullscreenContainer);
  });

  fullscreenContainer.addEventListener('click', (event) => {
    if (event.target === fullscreenContainer) {
      document.body.removeChild(fullscreenContainer);
    }
  });
}

function searchGifs() {
  const searchInput = document.getElementById('search-input');
  const query = searchInput.value.trim();
  const errorText = document.getElementById('error-text');
  if (query === '') {
    errorText.textContent = 'You have an empty field!';
    return;
  } else {
    errorText.textContent = '';
  }
  currentSearch = query;
  offset = 0;

  fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&offset=${offset}&limit=12`)
    .then(response => response.json())
    .then(data => {
      displayGifs(data.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function displayGifs(gifs) {
  const gifGrid = document.getElementById('gif-grid');
  gifGrid.innerHTML = '';

  if (gifs.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = 'Nothing was found according to your request.';
    gifGrid.appendChild(noResultsMessage);
    noResultsMessage.className = 'results__message'; // Добавление класса CSS
    gifGrid.appendChild(noResultsMessage);
    return;
  }

  gifs.forEach((gif) => {
    const gifItem = document.createElement('div');
    gifItem.className = 'gif-item';

    const img = document.createElement('img');
    img.src = gif.images.fixed_width.url;
    gifItem.appendChild(img);
    gifGrid.appendChild(gifItem);

    const downloadButton = document.createElement('button');
    downloadButton.classList.add('download__btn');
    downloadButton.textContent = 'Download';
    gifItem.appendChild(downloadButton);

    downloadButton.addEventListener('click', () => {
      downloadImage(gif.images.original.url);
    });

    img.addEventListener('click', () => {
      openFullscreen(img.src);
    });
  });
}

function downloadImage(url) {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'image.gif';
      downloadLink.click();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function loadMore() {
  offset += 12;
  fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${currentSearch}&offset=${offset}&limit=12`)
    .then(response => response.json())
    .then(data => {
      displayGifs(data.data);
      const lastGif = document.querySelector('.gif-item:last-child');
      lastGif.scrollIntoView({ behavior: 'smooth', block: 'end' });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}