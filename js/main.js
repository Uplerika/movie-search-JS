import { getDeclension } from "../js/getDeclension.js";
import { debounce } from "./debounce.js";
import "../js/currentYear.js";

const dMovies = getDeclension("фильм", "фильма", "фильмов");

const removeButton = document.getElementById("btn-remove");
const searchForm = document.getElementById("search");
const searchInput = searchForm.querySelector(".input");
const noResults = document.querySelector(".search");

const dataJSON = localStorage.getItem("movies");
dataJSON !== null ? searchMovies(JSON.parse(dataJSON)) : [];

// Search
const handleInput = (e) => {
  const { value } = e.target;
  const removeBtnHtml = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.75732 2.75732L16 16M16 16L29.2426 29.2426M16 16L29.2426 2.75732M16 16L2.75732 29.2426" stroke-width="4" stroke="white" stroke-opacity="0.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  if (value) {
    getMovies(value);
    removeButton.innerHTML = removeBtnHtml;
  }
  e.preventDefault();
};
const debouncedHandle = debounce(handleInput, 500);
searchInput.addEventListener("input", debouncedHandle);

// Tags
const tagsResult = document.querySelector(".tags-result");
let tagsBox = [];
searchForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const inputValue = searchInput.value.toLowerCase();
  const isSearch = tagsBox.includes(inputValue);

  if (inputValue && !isSearch) {
    tagsBox.unshift(inputValue);
    const tagshtml = tagsBox
      .map((tag) => {
        return `<div class="search-tag">${tag}</div>`;
      })
      .join("");
    tagsResult.innerHTML = tagshtml;
  }
  const searchTags = tagsResult.querySelectorAll(".search-tag");
  searchTags.forEach((tag) =>
    tag.addEventListener("click", (e) => {
      searchInput.value = tag.innerText;
      getMovies(tag.innerText);
    })
  );
  searchTags.forEach((tag) =>
    tag.addEventListener("dblclick", (e) => {
      tag.remove("");
      tagsBox = tagsBox.filter((el) => el != tag.innerText);
    })
  );
});

// search-cancel-button
removeButton.onclick = () => {
  searchInput.value = "";
  removeButton.innerHTML = "";
};

// Get Movies
function getMovies(value) {
  document.querySelector(".results").innerHTML = "";
  document.querySelector(
    ".results-title"
  ).innerHTML = `<span class="loader"></span>`;
  const Omdbapi_URL =
    "https://www.omdbapi.com/?apikey=88471ad8&s=" + value.toLowerCase();

  const cacheJSON = localStorage.getItem(Omdbapi_URL);

  if (cacheJSON != null) {
    searchMovies(JSON.parse(cacheJSON));
    localStorage.setItem("movies", cacheJSON);
  } else {
    fetch(Omdbapi_URL)
      .then((resp) => resp.json())
      .then((resp) => {
        //localStorage
        if (resp.Response === "True") {
          localStorage.setItem(Omdbapi_URL, JSON.stringify(resp));
          localStorage.setItem("movies", JSON.stringify(resp));
        }
        searchMovies(resp);
      })
      .catch((err) => {
        document.querySelector(".no-results").innerHTML =
          "Мы не смогли ничего найти ¯_(ツ)_/¯";
        noResults.classList.add("search_not_found");
      });
  }
}
/// Result
function searchMovies(moviesResult) {
  const moviesEl = document.querySelector(".results");
  document.querySelector(".results").innerHTML = "";
  document.querySelector(".results-title").innerHTML = "";

  moviesResult?.Search.forEach((movie) => {
    document.querySelector(".results-title").innerHTML = `Нашли ${
      moviesResult.totalResults
    } ${dMovies(moviesResult.totalResults)}`;

    if (moviesResult.Response === "True") {
      noResults.classList.remove("search_not_found");
    }
    const movieEl = document.createElement("div");
    movieEl.classList.add("results-card");
    movieEl.classList.add("card-gradient");
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
