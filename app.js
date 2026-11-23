function buildSearchURL(query) {
    return `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
}

async function fetchShows(query) {
  const url = buildSearchURL(query);
  console.log("Fetching: ", url);
  
  const response = await fetch(url);
  console.log("Status: ", response.status);
  
  return await response.json();
}

function processShows(result) {
  return result.filter(item =>
    item.show.genres.includes("Action") || item.show.genres.includes("Science-Fiction") || item.show.genres.includes("Fantasy"))
    .map(item => ({
        name: item.show.name,
        rating: item.show.rating.average,
        genres: item.show.genres
        image: item.show.image ? item.show.image.medium : "placeholder.jpb"
  }));
}

let allShows = [];

function renderShows(shows) {
  const container = document.getElementById("resultsContainer");
  container.innerHTML = "";

  if (shows.length === 0) {
      container.textContent = "No shows found.";
      return;
  }
    
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

    const image = document.createElement("img");
      image.src = show.image;
      imagle.alt = `${show.name} poster`;

    card.appendChild(title);
    card.appendChild(rating);
    card.appendChild(genres);
    card.appendChild(image);

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

document.getElementById("search").addEventListener("input", function() {
  const searchText = this.value.toLowerCase();
  const filtered = allShows.filter(show => show.name.toLowerCase().includes(searchText));
  renderShows(filtered);
});

function validateForm() {
  document.getElementById("searchError").textContent = "";
    document.getElementById("ratingError").textContent = "";
    
  let valid = true;
  const search = document.getElementById("search").value.trim();
  const rating = document.getElementById("rating").value;

  if (search === "") { 
    valid = false; 
    document.getElementById("searchError").textContent = "Search must be valid";
    return valid;
  }

  if (rating === "" || rating < 1 || rating > 10) {
    valid = false; 
    document.getElementById("ratingError").textContent = "Rating must be between 1 and 10";
    return valid;
  }

  return valid;
}

document.getElementById("searchForm").addEventListener("submit", async function(event) {
  event.preventDefault();
  if (!validateForm()) {
    return;
  }

  const query = document.getElementById("search").value;
  await searchShows(query);
});

document.getElementById("genre").addEventListener("change", applyFilters);

document.getElementById("rating").addEventListener("input", applyFilters);
