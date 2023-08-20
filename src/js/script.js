import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import axios from 'axios';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.photo-card a');

let currentPage = 1;
let currentQuery = '';

form.addEventListener('submit', event => {
  event.preventDefault();
  const searchQuery = event.target.searchQuery.value.trim();
  if (searchQuery === '') return;

  currentQuery = searchQuery;
  currentPage = 1;
  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';
  searchImages(searchQuery, currentPage);
});

loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  searchImages(currentQuery, currentPage);
});

async function searchImages(query, page) {
  const apiKey = '38937805-cf1427e6fae5a00593a9f84de';
  const perPage = 40;

  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    const data = response.data;

    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    gallery.innerHTML += data.hits
      .map(image => createImageCard(image))
      .join('');
    lightbox.refresh();

    if (data.totalHits <= page * perPage) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreBtn.style.display = 'block';
    }

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

function createImageCard(image) {
  return `
    <div class="photo-card">
      <a href="${image.largeImageURL}" data-lightbox="gallery-item">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    </div>
  `;
}
