import { http, HttpResponse } from 'msw';
import lastfmTopTracks from '../../fixtures/gettoptracks.json';
import { createSpotifyUserTracksMock } from '../../factories/tracks';

export const handlers = [
  http.get('http://ws.audioscrobbler.com/2.0/', ({ request }) => {
    const method = new URL(request.url).searchParams.get('method');

    if (method === 'chart.gettoptracks') {
      return HttpResponse.json(lastfmTopTracks);
    }

    return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
  }),

  http.get('https://api.spotify.com/v1/me/top/tracks', ({ request }) => {
    const token = request.headers.get('Authorization');

    if (!token) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = createSpotifyUserTracksMock();

    return HttpResponse.json(payload);
  }),
];
