const clientId = '8e267c3c314341ab8f0bbd85daf5375f';
const clientSecret = '3adebf97f7ff402c9251d9fcdf7beee1';

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials'
  });
  const json = await response.json();
  return json.access_token;
}


async function loadArtist(artistId) {
  const accessToken = await getAccessToken();
  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  });
  const artist = await response.json();
  const artistName = artist.name;
  let artistFollower = artist.followers.total;
  const artistImage = artist.images[0].url;
  const artistGenre = artist.genres[0];
  const artistPopularity = artist.popularity;



  const numStr = artistFollower.toString();
  const numChars = numStr.split('');
  const formatted = [];

  for (let i = numChars.length - 1; i >= 0; i--) {
    formatted.unshift(numChars[i]);
    if (i > 0 && (i + 1) % 3 === 0) {
      formatted.unshift(',');
    }
  }
  artistFollower = formatted.join('');


  const artistImageElement = document.getElementById("artist-image");
  artistImageElement.src = artistImage;

  const artistNameElement = document.getElementById('artist-name');
  artistNameElement.innerHTML = artistName;

  const artistFollowerElement = document.getElementById('arist-followers');
  artistFollowerElement.insertAdjacentHTML("beforeend", artistFollower);

  const artistGenreElement = document.getElementById("artist-genre");
  artistGenreElement.insertAdjacentHTML("beforeend", artistGenre);

  const artistPopularityElement = document.getElementById("artist-popularity");
  artistPopularityElement.insertAdjacentHTML("beforeend", artistPopularity);
}

async function searchArtists(query) {
  const accessToken = await getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=artist`, {
    headers: {
      "Authorization": "Bearer " + accessToken,
    },
  });
  const data = await response.json();
  renderArtistCards(data.artists.items);
  }




function renderArtistCards(artists) {
  const searchResultsElement = document.getElementById('search-results');
  searchResultsElement.innerHTML = '';

  for (const artist of artists) {
    const artistCardElement = document.getElementById('artist-card-template').content.cloneNode(true);
    artistCardElement.querySelector('.artist-name').innerHTML = artist.name;

    let artistFollower = artist.followers.total;
    const numStr = artistFollower.toString();
    const numChars = numStr.split('');
    const formatted = [];

    for (let i = numChars.length - 1; i >= 0; i--) {
      formatted.unshift(numChars[i]);
      if (i > 0 && (i + 1) % 3 === 0) {
        formatted.unshift(',');
      }
    }
    artistFollower = formatted.join('');

    artistCardElement.querySelector('.artist-card').setAttribute("data-artist-id", artist.id);
    artistCardElement.querySelector('.artist-followers').insertAdjacentHTML("beforeend", artistFollower);
    artistCardElement.querySelector('.artist-image').src = artist.images[0].url;
    searchResultsElement.appendChild(artistCardElement);
  }
}

function openOverview(card) {
  const artistId = card.getAttribute("data-artist-id");
  window.location.href = `overview.html?artistId=${artistId}`;
}


async function loadOverview() {
  const params = new URLSearchParams(window.location.search);
  const artistId = params.get("artistId");
  loadArtist(artistId);
 }

async function switchTabRelatedArtists() {
  const currentURL = new URL(window.location.href);
  const artistId = new URLSearchParams(currentURL.search).get('artistId');
  window.location.href = `related-artists.html?artistId=${artistId}`;

  console.log(artistId);
}

async function switchTabAlbums() {
  const currentURL = new URL(window.location.href);
  const artistId = new URLSearchParams(currentURL.search).get('artistId');
  window.location.href = `albums.html?artistId=${artistId}`;

  console.log(artistId);
}

async function switchTabTracks() {
  const currentURL = new URL(window.location.href);
  const artistId = new URLSearchParams(currentURL.search).get('artistId');
  window.location.href = `tracks.html?artistId=${artistId}`;

  console.log(artistId);
}

async function switchTabOverview() {
  const currentURL = new URL(window.location.href);
  const artistId = new URLSearchParams(currentURL.search).get('artistId');
  window.location.href = `overview.html?artistId=${artistId}`;

  console.log(artistId);
}
