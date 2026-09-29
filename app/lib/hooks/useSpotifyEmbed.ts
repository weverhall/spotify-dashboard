import { useEffect, useRef, useState } from 'react';

type PlaybackUpdate = {
  data: { isPaused: boolean; isBuffering: boolean; position: number; duration: number };
};

type EmbedController = {
  loadUri: (uri: string) => void;
  play: () => void;
  togglePlay: () => void;
  destroy: () => void;
  addListener: (event: 'playback_update', callback: (e: PlaybackUpdate) => void) => void;
};

type IFrameAPI = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width: string; height: number },
    callback: (controller: EmbedController) => void
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
  }
}

let apiPromise: Promise<IFrameAPI> | null = null;

const loadIframeApi = (): Promise<IFrameAPI> => {
  apiPromise ??= new Promise((resolve) => {
    window.onSpotifyIframeApiReady = resolve;
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    document.body.appendChild(script);
  });
  return apiPromise;
};

const trackUri = (id: string) => `spotify:track:${id}`;

export const useSpotifyEmbed = (initialTrackId: string | null) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<EmbedController | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (!initialTrackId) return;
    let cancelled = false;

    loadIframeApi().then((api) => {
      if (cancelled || !hostRef.current) return;

      const element = document.createElement('div');
      hostRef.current.appendChild(element);

      api.createController(
        element,
        { uri: trackUri(initialTrackId), width: '100%', height: 80 },
        (controller) => {
          if (cancelled) return controller.destroy();
          controllerRef.current = controller;
          controller.addListener('playback_update', (e) => setIsPaused(e.data.isPaused));
        }
      );
    });

    return () => {
      cancelled = true;
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, [initialTrackId]);

  const play = (trackId: string) => {
    const controller = controllerRef.current;
    if (!controller) return;

    if (trackId === currentId) {
      controller.togglePlay();
      return;
    }

    controller.loadUri(trackUri(trackId));
    controller.play();
    setCurrentId(trackId);
  };

  const isPlaying = (trackId: string) => trackId === currentId && !isPaused;

  return { hostRef, play, isPlaying, currentId };
};
