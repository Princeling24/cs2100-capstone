function buildSearchURL(query) {
  return `https://api.tvmaze.com/search/shows?q=${query}`;
}

async function fetchShows(query) {
  const response = await fetch(buildSearchURL(query));
  return await response.json();
}

function processShows(result) {
  return result.map(item => ({
    name: item.show.name,
    rating: item.show.rating.average,
    genres: item.show.genres
  });
}

function logShows(query) {
  console.log(shows);
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

document
.getElementById("searchForm")

.addEventListener("submit", async function(event) {
  event.preventDefault();
  const query = document.getElementById("search").value;
  await searchShows(query);
});
