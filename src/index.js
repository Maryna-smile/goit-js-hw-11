import './css/hw11.css';
import Notiflix from 'notiflix';
import { PixabayApi } from './js/pixabay.js';
import makeGalleryCard from './templates/galleryCard.hbs';
import onInputChange from "./js/onInputChange.js";

// ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const lightbox = new SimpleLightbox('.gallery a', { CaptionDelay: 250 });
// ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;


const searchFormRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtnRef = document.querySelector('.load-more-btn');


const inputCheckbox = document.querySelector(".checkbox");
const body = document.querySelector("body");



const pixabayApi = new PixabayApi();

const onSearchFormSubmit = async event => {
    event.preventDefault();

    pixabayApi.page = 1;
    pixabayApi.searchQuery = event.target.elements.searchQuery.value;

    try {
        const { data } = await pixabayApi.fetchPhotos();

        if (!pixabayApi.searchQuery) {
            Notiflix.Notify.failure("Хоч щось потрібно ввести...");
            loadMoreBtnRef.classList.add('is-hidden');
            return;
        }

        if (data.totalHits === 0) {
            Notiflix.Notify.failure("Ото запит!!! 😡 В нас таких картинок немає :((");
            event.target.elements.searchQuery.value = "";
            galleryRef.innerHTML = "";
            loadMoreBtnRef.classList.add('is-hidden');
            return;
        }

        if (data.totalHits < 41) {
            galleryRef.innerHTML = makeGalleryCard(data.hits);
            lightbox.refresh();
            return;
        }
        Notiflix.Notify.info(`Урррра - э контакт, ми знайшли ${data.totalHits} фоточок :))`);
        galleryRef.innerHTML = makeGalleryCard(data.hits);
        lightbox.refresh();
        loadMoreBtnRef.classList.remove('is-hidden');
        loadMoreBtnRef.addEventListener('click', onLoadMoreBtnClick);

    } catch (err) {
        console.log(err);
    }
};

const onLoadMoreBtnClick = async event => {

    try {
        pixabayApi.page += 1;
        const { data } = await pixabayApi.fetchPhotos();
        galleryRef.insertAdjacentHTML('beforeend', makeGalleryCard(data.hits));
        lightbox.refresh();

        if ( pixabayApi.page === Math.ceil(data.totalHits/40)) {
            loadMoreBtnRef.classList.add('is-hidden');
        }

        if (data.totalHits === pixabayApi.page) {
            Notiflix.Notify.info("Баста, карапузікі, кончіліся танци... 😪 більше картинок немає, це все");
            loadMoreBtnRef.classList.add('is-hidden');
        }

    } catch (err) {
        console.log(err);
    }

    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 3,
        behavior: "smooth",
    });

};

searchFormRef.addEventListener('submit', onSearchFormSubmit);
// theme

inputCheckbox.addEventListener("change", onInputChange);

function checkTheme() {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark-theme") {
        inputCheckbox.checked = true;
        body.classList.replace("light-theme", "dark-theme");

    }
};

checkTheme();




