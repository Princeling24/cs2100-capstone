function buildSearchURL(query) {
  return `https://api.tvmaze.com/search/shows?q=${query}`;
}

async function fetchShows(query) {
  const response = await fetch(buildSearchURL(query));
  return await response.json();
}

function processShows(result) {
  return result.filter(item =>
    item.show.genres.includes("Action) || item.show.genres.includes("Science-Fiction") || item.show.genres.includes("Fantasy"))
    .map(item => ({
    name: item.show.name,
    rating: item.show.rating.average,
    genres: item.show.genres
  }));
}

let allShows = [];

function renderShows(shows) {
  const container = document.getElementById("resultsContainer");
  container.innerHTML = "";
  const fragment = document.createDocumentFragment();
  shows.forEach(show => {
    const card = document.createElement("article");
    card.classList.add("show-card");

    card.dataset.rating = show.rating || 0;
    card.dataset.genre = show.genres.join(",");

    const title = document.createElement("h4");
      title.textContent = show.name;

    const rating = document.createElement("p");
    rating.textContent = `Rating: ${show.rating ?? "N/A"}`;

    const genres = document.createElement("p");
    genres.textContent = `Genres: ${show.genres.join(", ")}`;

    card.appendChild(title);
    card.appendChild(rating);
    card.appendChild(genres);

    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

async function searchShows(query) {
  try {
    const results = await fetchShows(query);
    const shows = processShows(results);
    logShows(shows);
  }
  catch (error) {
    console.error("error fetching shows:", error);
  }
}

function applyFilters() {
  const selectGenre = document.getElementById("genre").value;

  const minRating = Number(document.getElementById("rating").value || 0;

  const filteredShows = allShows.filter(show => {
    const genreMatch = show.genres.includes(selectedGenre);

    const ratingMatch = (show.rating || 0) >= minRating;

    return genreMatch && ratingMatch;
  });

  renderShows(filteredShows);
}

document
.getElementById("searchForm")

.addEventListener("submit", async function(event) {
  event.preventDefault();
  const query = document.getElementById("search").value;
  await searchShows(query);
});
