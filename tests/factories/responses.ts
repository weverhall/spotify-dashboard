export const createFetchSuccessMock = <T>(data: T, overrides?: ResponseInit): Response =>
  new Response(JSON.stringify(data), {
    status: 200,
    statusText: 'OK',
    headers: { 'Content-Type': 'application/json' },
    ...overrides,
  });

export const createFetchFailureMock = <T>(data: T, overrides?: ResponseInit): Response =>
  new Response(JSON.stringify(data), {
    status: 401,
    statusText: 'Unauthorized',
    headers: { 'Content-Type': 'text/plain' },
    ...overrides,
  });
