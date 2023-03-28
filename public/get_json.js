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



async function loadAlbums(artistId) {
  // Make request to the Spotify API to get the artist's albums
  const accessToken = await getAccessToken();
  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
    headers: {
      "Authorization": "Bearer " + accessToken,
    },
  });
  const data = await response.json();

  // Get the template element
  const template = document.getElementById("albums-card-template");

  // Loop through the list of albums
  for (const album of data.items) {


    const clone = template.content.cloneNode(true);
    const albumCover = album.images[0].url;
    const albumTitle = album.name;
    const albumReleaseDate = album.release_date;
    const albumId = album.id;
    const albumHref = album.external_urls.spotify;
    console.log(albumHref);



    // Set the album cover image
    const albumCoverElement = clone.querySelector(".album-cover");
    albumCoverElement.src = albumCover;

    // Set the album title
    const albumTitleElement = clone.querySelector(".album-title");
    albumTitleElement.innerHTML = albumTitle;

    // Set the album release date
    const albumReleaseDateElement = clone.querySelector(".album-release-date");
    albumReleaseDateElement.innerHTML = `Released: ${albumReleaseDate}`;

    // Set the album id
    const albumCardElement = clone.querySelector(".album-card");
    albumCardElement.setAttribute("data-album-id", albumId);

    // Append the cloned template to the container
    const albumCardsContainer = document.querySelector(".album-cards-container");
    albumCardsContainer.appendChild(clone);
  }
}


async function loadPopularTracks(artistId) {
  // First, we need to get an access token from the Spotify API
  const accessToken = await getAccessToken();

  // Next, we can use the access token to make a request to the Spotify API to get the artist's top tracks
  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`, {
    headers: {
      "Authorization": "Bearer " + accessToken,
    },
  });

  // We can parse the response as JSON to get the array of tracks
  const data = await response.json();
  const tracks = data.tracks;

  const template = document.getElementById("track-card-template");

  // We can then iterate over the array of tracks and extract the information we need
  for (let track of tracks) {
    const clone = template.content.cloneNode(true);
    const trackName = track.name;
    const trackAlbum = track.album.name;
    const trackReleaseDate = track.album.release_date;
    const trackCoverImageUrl = track.album.images[0].url;

    // Here, you can do something with the track information, such as displaying it on the page or saving it to a database.
    // Set the track cover image
    const trackCoverElement = clone.querySelector(".track-cover");
    trackCoverElement.src = trackCoverImageUrl;

    // Set the track title
    const trackTitleElement = clone.querySelector(".track-title");
    trackTitleElement.innerHTML = trackName;

    //Set Album Name
    const trackAlbumTitleElement = clone.querySelector(".album-name");
    trackAlbumTitleElement.innerHTML = trackAlbum;

    // Set the track release date
    const trackReleaseDateElement = clone.querySelector(".track-release-date");
    trackReleaseDateElement.innerHTML = `Released: ${trackReleaseDate}`;

    // Append the cloned template to the container
    const trackCardsContainer = document.querySelector(".track-cards-container");
    trackCardsContainer.appendChild(clone);
  }
}

async function loadRelatedArtists(artistId) {
  const accessToken = await getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
    headers: {
      "Authorization": "Bearer " + accessToken,
    },
  });
  const data = await response.json();

  const relatedArtistsContainer = document.querySelector('.related-artist-cards-container');


  // Iterate through the list of related artists
  for (const relatedArtist of data.artists) {
    // Create a new element using the template
    const relatedArtistElement = document.querySelector('#related-artist-card-template').content.cloneNode(true);

    // Set the values for the related artist
    relatedArtistElement.querySelector('.related-artist-name').innerHTML = relatedArtist.name;
    relatedArtistElement.querySelector('.related-artist-image').src = relatedArtist.images[0].url;
    relatedArtistElement.querySelector('.related-artist-popularity').innerHTML = "Popularity: " + relatedArtist.popularity;
    relatedArtistElement.querySelector('.related-artist-genre').innerHTML = relatedArtist.genres[0];

    // Add the related artist element to the container
    relatedArtistsContainer.appendChild(relatedArtistElement);
  }
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


async function getOverview() {
  const params = new URLSearchParams(window.location.search);
  const artistId = params.get("artistId");
  loadArtist(artistId);
 }

 async function getAlbums() {
   const params = new URLSearchParams(window.location.search);
   const artistId = params.get("artistId");
   loadAlbums(artistId);
  }

  async function getPopularTracks() {
    const params = new URLSearchParams(window.location.search);
    const artistId = params.get("artistId");
    loadPopularTracks(artistId);
  }

  async function getRelatedArtists() {
    const params = new URLSearchParams(window.location.search);
    const artistId = params.get("artistId");
    loadRelatedArtists(artistId);
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
