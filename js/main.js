import { getDeclension } from '../js/getDeclension.js';
import '../js/currentYear.js';

const dMovies = getDeclension('фильм', 'фильма', 'фильмов');

let input = document.getElementById('searchMovies');
let remove = document.getElementById('btn-remove');
let noResults = document.querySelector('.search');
let form = document.querySelector('.search-form');

input.addEventListener('input', function(e) {
  let searchTitle = input.value;
  if (input.value) {
    getMovies(searchTitle);
    remove.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.75732 2.75732L16 16M16 16L29.2426 29.2426M16 16L29.2426 2.75732M16 16L2.75732 29.2426" stroke-width="4" stroke="white" stroke-opacity="0.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  } else {
    remove.innerHTML = '';
  }
  e.preventDefault();
});

form.addEventListener('submit', function(e) {
  let searchTitle = input.value;
  if (input.value) {
    getMovies(searchTitle);
    document.querySelector(
      '.search-items-box'
    ).innerHTML += `<div class="search-item">${searchTitle}</div>`;
  }
  e.preventDefault();
});

remove.onclick = () => {
  input.value = '';
  remove.innerHTML = '';
  document.querySelector('.results').innerHTML = '';
  document.querySelector('.results-title').innerHTML = '';
};

function getMovies(searchTitle) {
  const Omdbapi_URL =
    'https://www.omdbapi.com/?apikey=88471ad8&s=' + searchTitle;
  fetch(Omdbapi_URL)
    .then((resp) => resp.json())
    .then((resp) => {
      console.log(resp);
      searchMovies(resp);
      //searchTagsMovies(resp);
    })
    .catch((err) => {
      console.log(`Случилась ошибка. Проверьте консоль.`);
      document.querySelector('.no-results').innerHTML =
        'Мы не смогли ничего найти ¯_(ツ)_/¯';
      noResults.classList.add('search_not_found');
    });
}

function searchMovies(data) {
  const moviesEl = document.querySelector('.results');
  document.querySelector('.results').innerHTML = '';
  document.querySelector('.results-title').innerHTML = '';

  data.Search.forEach((movie) => {
    document.querySelector('.results-title').innerHTML = `Нашли ${
      data.totalResults
    } ${dMovies(data.totalResults)}`;

    if (data.Response === 'True') {
      noResults.classList.remove('search_not_found');
    }

    const movieEl = document.createElement('div');
    movieEl.classList.add('results-card');
    movieEl.classList.add('card-gradient');
    movieEl.innerHTML = `
    <img class="results-card-img" src="${movie.Poster}" alt="${movie.Title}">
					<div hidden class="loading__text">
						<a href="https://www.imdb.com/title/${
              movie.imdbID
            }" target="_blank" title="Перейти"><h3 class="text-all">${
      movie.Title
    }</h3></a>
						<div class="loading__text-info text-info">
							<span>${movie.Type}</span>
							<span>${movie.Year}</span>
						</div>
					</div>
    `;
    moviesEl.appendChild(movieEl);
  });
}
