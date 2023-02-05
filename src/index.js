import './css/index.min.css';
import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

form.addEventListener('submit', handleSubmit);
loadMore.addEventListener('click', handleClick);

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: '100',
});

let page;
let inputValue;
let totalpages;

function handleSubmit(e) {
  e.preventDefault();
  page = 1;

  const {
    elements: { searchQuery },
  } = e.currentTarget;
  inputValue = searchQuery.value;
  fetchImages(inputValue, page)
    .then(response => {
      totalpages = Math.ceil(
        response.data.totalHits / response.data.hits.length
      );
      if (response.data.total > 0) {
        clearGallery();
        renderImagesList(response.data.hits);
        loadMore.classList.remove('hidden');
        scrollToTop();
        Notiflix.Notify.success(
          `Hooray! We found ${response.data.totalHits} images.`
        );
      } else {
        clearGallery();
        loadMore.classList.add('hidden');
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function handleClick() {
  page++;
  fetchImages(inputValue, page)
    .then(response => {
      renderImagesList(response.data.hits);
      scrollBelow();
      if (page === totalpages) {
        loadMore.classList.add('hidden');
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => {
      console.log(error);
    });
}
function renderImagesList(images) {
  const markup = images
    .map(image => {
      return `
<div class="photo-card">
    <a class="photo-link" href="${image.largeImageURL}">
        <img class="photo-image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    </a>
    <div class="info">
        <p class="info-item">
            <b>Likes</b>${image.likes}
        </p>
        <p class="info-item">
            <b>Views</b>${image.views}
        </p>
        <p class="info-item">
            <b>Comments</b>${image.comments}
        </p>
        <p class="info-item">
            <b>Downloads</b>${image.downloads}
        </p>
    </div>
</div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  refreshLightbox();
}

function clearGallery() {
  while (gallery.firstChild) {
    gallery.firstChild.remove();
  }
}

function refreshLightbox() {
  lightbox.refresh();
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollBelow() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
