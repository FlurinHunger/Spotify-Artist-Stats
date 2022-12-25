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
  const artistFollower = artist.followers.total;



  const artistNameElement = document.getElementById('artist-name');
  artistNameElement.innerHTML = artistName;

  const artistFollowerElement = document.getElementById('arist-followers');
  artistFollowerElement.insertAdjacentHTML("beforeend", artistFollower);
}
