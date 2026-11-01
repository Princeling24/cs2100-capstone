function buildSearchURL(query) {
  return 'https://api.tvmaze.com/search/shows?q=${query}';
}

async function fetchShows(query) {
  const response = await fetch(buildSearchURL(query));
  return await response.json();
}

function logShows(query) {
  console.log(shows);
}

async function searchShows(query) {
  try {
    const shows = await fetchShows(query);
  }
  catch (error) {
    console.error("error fetching shows:", error);
  }
}

documemnt
.getElementById("searchForm")

.addEventListener("submit", async function(event) {
  event.preventDefault();
  const query = document.getElementById("search").value;
  await searchShows(query);
});
