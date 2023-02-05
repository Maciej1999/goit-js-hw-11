import Notiflix from 'notiflix';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

const searchParams = new URLSearchParams({
  key: '1600525-016427548b1ce21d96fbba306',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: 40,
});

export async function fetchImages(searchValue, page) {
  try {
    const response = await axios.get(
      `${BASE_URL}?${searchParams}&q=${searchValue}&page=${page}`
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}
