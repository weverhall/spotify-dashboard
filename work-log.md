## Work Log

| date | hours | work  |
| :----:|:-----| :-----|
| 2025   |      | |
| 28.11. | 9    | researched suitable topics, refined implementation ideas |
| 1.12.  | 6    | ran create-next-app, expanded the app skeleton, updated dependencies, customized linting |
| 2.12.  | 5    | acquired spotify web api secrets, added client credentials token fetching |
|        | 3    | implemented zod schemas |
| 3.12.  | 5    | started coding vercel kv after checking out free hosting options that would offer redis-style cache and mongodb support |
| 4.12.  | 8    | continued working towards online spotify user login using auth token fetch and session cookie, improved project structure and typing |
| 5.12.  | 3    | switched from vercel to render hosting and changed session related code accordingly |
|        | 1    | confirmed that the cookie and the token do indeed go into the db, updated dependencies to patch react2shell vulnerability |
| 6.12.  | 2    | made sure to not return user's full auth token object to the client, added token ttl fetch from redis |
|        | 5    | began to use the refresh token of my own credentials to fetch the actual global playlist contents |
|        | 1    | centralized env variables and redis client creation to shared utils files |
| 7.12.  | 3    | spent hours investigating why spotify api returns 404 for all algorithmic and curated playlists, and apparently about a year ago they removed that endpoint for new api users, so currently my plan is to pivot to using some other api for global trends data |
| 10.12. | 5    | started implementing user-specific spotify api logic and stopped trying to fetch playlist data from a deprecated endpoint with a separate non-expiring refresh token |
| 12.12. | 4    | began using docker containers and localhost.run oauth callback tunneling for local dev, created a production dockerfile for render as well |
| total  | 60   | |
