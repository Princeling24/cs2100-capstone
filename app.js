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
    console.error("error fetching data:", error);
  }
}
