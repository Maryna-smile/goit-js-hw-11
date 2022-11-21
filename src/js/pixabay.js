import axios from "axios";

export class  PixabayApi {
    #BASE_URL = 'https://pixabay.com/api/';
    #API_KEY = '31432511-b7965565b9f0f737e4e31f534';
    
constructor() {
    this.page = null;
    this.searchQuery  = null;
}

fetchPhotos() {
     const searchParams = {
      params: {
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: '40',
        key: this.#API_KEY
    },
    };
    return axios.get(`${this.#BASE_URL}`, searchParams);
  }
}
