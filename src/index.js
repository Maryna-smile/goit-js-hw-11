import './css/hw11.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import { PixabayApi } from './js/pixabay.js';
import makeGalleryCard from './templates/galleryCard.hbs';

const searchFormRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtnRef = document.querySelector('.load-more-btn');

const pixabayApi = new PixabayApi();

const onSearchFormSubmit = event => {
    event.preventDefault();

    pixabayApi.page = 1;
    pixabayApi.searchQuery = event.target.elements.searchQuery.value;
    pixabayApi
        .fetchPhotos()
        .then(({ data }) => {
            console.log(data)
            if (!pixabayApi.searchQuery) {
                Notiflix.Notify.failure("Хоч щось потрібно ввести...");
                return;
            }

            if (data.totalHits === 0) {
                Notiflix.Notify.failure("Ото запит!!! 😡 В нас таких картинок немає :((");
                galleryRef.innerHTML = "";
                return;
            }

            if (data.totalHits < 41) {
                galleryRef.innerHTML = makeGalleryCard(data.hits);
                return;
            }

            galleryRef.innerHTML = makeGalleryCard(data.hits);
            loadMoreBtnRef.classList.remove('is-hidden');
            loadMoreBtnRef.addEventListener('click', onLoadMoreBtnClick);
        })
        .catch(err => {
            console.log(err)
        });
};

const onLoadMoreBtnClick = event => {
    pixabayApi.page += 1;

    pixabayApi.fetchPhotos()
        .then(({ data }) => {
            galleryRef.insertAdjacentHTML('beforeend', makeGalleryCard(data.hits));
            if (data.totalHits === pixabayApi.page) {
                Notiflix.Notify.info("Баста, карапузікі, кончіліся танци... 😪 більше картинок немає, це все");
                loadMoreBtnRef.classList.add('is-hidden');
            }
        });

}

searchFormRef.addEventListener('submit', onSearchFormSubmit);
// loadMoreBtnRef.addEventListener('click', onLoadMoreBtnClick);











// const { height: cardHeight } = document.querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });


// key (required)	str	Your API key: 31432511-b7965565b9f0f737e4e31f534


