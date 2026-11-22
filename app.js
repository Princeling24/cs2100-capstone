function buildSearchURL(query) {
  return `https://api.tvmaze.com/search/shows?q=${query}`;
}

async function fetchShows(query) {
  const response = await fetch(buildSearchURL(query));
  return await response.json();
}

function processShows(result) {
  return result.filter(item =>
    item.show.genres.includes("Action") || item.show.genres.includes("Science-Fiction") || item.show.genres.includes("Fantasy"))
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
    allShows = shows;
    renderShows(shows);
  }
  catch (error) {
    console.error("error fetching shows:", error);
  }
}

function applyFilters() {
  const selectGenre = document.getElementById("genre").value;

  const minRating = Number(document.getElementById("rating").value || 0);

  const filteredShows = allShows.filter(show => {
    const genreMatch = show.genres.includes(selectGenre);

    const ratingMatch = (show.rating || 0) >= minRating;

    return genreMatch && ratingMatch;
  });

  renderShows(filteredShows);
}

document.getElementById("searchForm").addEventListener("submit", async function(event) {
  event.preventDefault();
  const query = document.getElementById("search").value;
  await searchShows(query);
});

document.getElementById("search").addEventListener("input", function() {
  const searchText = this.value.toLowerCase();
  const filtered = allShows.filter(show => show.name.toLowerCase().includes(searchText));
  renderShows(filtered);
});

function validateForm() {
  let valid = true;
  const search = document.getElementById("search").value.trim();
  const rating = document.getElementById("rating").value;

  if (document.getElementById("searchError").textContent = "") { 
    valid = false; 
    document.getElementById("searchError").textContent = "Search must be valid";
    return valid;
  }

  if (document.getElementById("ratingError").textContent = "") {
    valid = false; 
    document.getElementById("searchError").textContent = "Rating must be between 1 and 10";
    return valid;
  }
}

document.getElementById("searchForm").addEventListener("submit", async function(event) {
  event.preventDefault();
  if (!validateForm()) {
    return;
  }

  const query = document.getElementById("search").value;
  await searchShows(query);
});
