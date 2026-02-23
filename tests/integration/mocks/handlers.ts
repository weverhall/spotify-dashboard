import { http, HttpResponse } from 'msw';
import { createLastfmTrackMock } from '../../factories/tracks';
import { createSpotifyUserTracksMock } from '../../factories/tracks';

export const handlers = [
  http.get('http://ws.audioscrobbler.com/2.0/', ({ request }) => {
    const url = new URL(request.url);
    const method = url.searchParams.get('method');

    if (method === 'chart.gettoptracks') {
      const tracks = Array.from({ length: 3 }, (_, i) => createLastfmTrackMock({}, i + 1));
      return HttpResponse.json({ tracks: { track: tracks } });
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
