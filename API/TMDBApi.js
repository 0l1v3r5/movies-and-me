import { API_URL, API_TOKEN, APP_LOCALE, API_BASE_URL } from "@env";
import fetch from "node-fetch";

export function getFilmsFromApiWithSearchedText(text, page) {
  const url =
    `${API_URL}` +
    API_TOKEN +
    `&language=${APP_LOCALE}&query=` +
    text +
    "&page=" +
    page;

  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

export function getImageFromApi(name) {
  return "https://image.tmdb.org/t/p/w300" + name;
}

export function getTrendingMovies(media_type = "all", time_window = "day") {
  const url = `${API_BASE_URL}trending/${media_type}/${time_window}?${API_TOKEN}&language=${APP_LOCALE}&page=${page}`;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

export function getFilmDetailFromApi(id) {
  const url = `${API_BASE_URL}movie/${id}?api_key=${API_TOKEN}&language=${APP_LOCALE}`;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}
