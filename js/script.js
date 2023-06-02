const apiKey = 'BIDZ83IwtzntGDCRNKNxuqt8pr0iIIBD';
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
searchClear.addEventListener('click', () => {
  searchInput.value = '';
});
    
let offset = 0;
let currentSearch = '';

function searchGifs() {
  const searchInput = document.getElementById('search-input');
  const query = searchInput.value.trim();
  
  if (query === '') {
    return;
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
  
  gifs.forEach((gif) => {
    const gifItem = document.createElement('div');
    gifItem.className = 'gif-item';

    const img = document.createElement('img');
    img.src = gif.images.fixed_width.url;

    const downloadButton = document.createElement('button');
    downloadButton.classList.add('download-button');

    const downloadIcon = document.createElement('i');
    downloadIcon.classList.add('fas', 'fa-download');
    downloadButton.appendChild(downloadIcon);
    downloadButton.addEventListener('click', () => {
      downloadGif(gif.images.original.url, 'gif');
    });

    gifItem.appendChild(img);
    gifItem.appendChild(downloadButton);
    gifGrid.appendChild(gifItem);
  });
  const loadMoreButton = document.getElementById('load-more');
  if (gifs.length === 0) {
    loadMoreButton.style.display = 'none'; // Скрываем кнопку "Загрузить ещё", если GIF-изображений нет
  } else {
    loadMoreButton.style.display = 'block'; // Показываем кнопку "Загрузить ещё", если есть GIF-изображения
  }

  
}

function loadMore() {
  offset += 12;
  fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${currentSearch}&offset=${offset}&limit=12`)
    .then(response => response.json())
    .then(data => {
      displayGifs(data.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function downloadGif(url, fileName) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}