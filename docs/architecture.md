# Architecture

## Public client

The client is public by design. It is the browser-side executor:

- renders DK Timer UI
- reads user-selected inputs from the DK page
- calls the private API
- receives plans/config from the API
- fills forms and clicks buttons in the browser

The client must not contain secrets or premium planner logic.

## Private API

The API is private and deployed to Vercel:

- license validation
- premium planner engine
- feature flags and limits
- abuse/rate limit checks

The API URL can be public. The secret logic and env variables must stay server-side.
