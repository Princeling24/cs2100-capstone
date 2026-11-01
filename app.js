function buildSearchURL(query) {
  return 'https://api.tvmaze.com/search/shows?q=${query}';
}

async function fetchShows(query) {
  const response = await fetch(buildSearchURL(query));
  const data = await response.json();
  return data;
}
