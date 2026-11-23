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
        rating: item.show.rating.average || 0,
        genres: item.show.genres,
        image: item.show.image ? item.show.image.medium : "placeholder.jpg",
        status: item.show.status,
        type: item.show.type,
        network: item.show.network ? item.show.network.name : ""
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
      image.alt = `${show.name} poster`;

    const favoriteButton = document.createElement("button");
      favoriteButton.textContent = "Favorite";

    card.appendChild(title);
    card.appendChild(rating);
    card.appendChild(genres);
    card.appendChild(image);
    card.appendChild(favoriteButton);

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
  const selectStatus = document.getElementById("status").value;
  const selectType = document.getElementById("type").value;
  const selectStudio = document.getElementById("studio").value;

  const minRating = Number(document.getElementById("rating").value || 0);

  const filteredShows = allShows.filter(show => {
    const genreMatch = show.genres.includes(selectGenre);

    const ratingMatch = (show.rating || 0) >= minRating;

    let statusMatch = true;
    if (seclectStatus === "On-Going") {
        statusMatch = show.status === "Running"; 
    }
    else if (selectStatus === "Completed") {
      statusMatch = show.status === "Ended";
  }

    let typeMatch = true;
    if (selectType === "Animated") {
        typeMatch = show.type === "Animation";
    }
    else if (selectType === "Live Action") {
        typeMatch = show.type !== "Animation";
    }

    let studioMatch = true;
    if (selectStudio === "Marvel") {
        studioMatch = show.name.toLowerCase().includes("marvel");
    }
    else if (selectStudio === "DC") {
        studioMatch = show.name.toLowerCase().includes("dc");
    }
    else if (selectStudio === "Netflix") {
        studioMatch = show.network && show.name.toLowerCase().includes("netflix");
    }
    else if (selectStudio === "Amazon") {
        studioMatch = show.network && show.name.toLowerCase().includes("amazon");
    }
}

    return genreMatch && ratingMatch && statusMatch && typeMatch && studioMatch;
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

document.getElementById("status").addEventListener("change", applyFilters);

document.getElementById("type").addEventListener("change", applyFilters);

document.getElementById("studio").addEventListener("change", applyFilters);
