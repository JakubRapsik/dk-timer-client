# DK Timer Client

Public Tampermonkey client for DK Timer.

This repository should contain only browser-side UI/executor code:

- Tampermonkey userscript
- DK page UI
- local plan table/status rendering
- API calls to the private backend
- DOM form filling/clicking that must run in the player's browser

Protected planner/business logic belongs in the private `dk-timer-api` repository.

## Install

After publishing this repository, install the userscript from the raw GitHub URL:

```text
https://raw.githubusercontent.com/<owner>/dk-timer-client/main/userscript/DKTimer.user.js
```

Tampermonkey will use the userscript metadata for updates.

## API

The client should call the private API, for example:

```js
const API_BASE = "https://dk-timer-api.vercel.app";
```

Premium endpoints must be validated on the API on every call.

## Publish to GitHub

Create a public GitHub repository named `dk-timer-client`, then run:

```bash
git remote add origin git@github.com:<owner>/dk-timer-client.git
git push -u origin main
```

Replace `<owner>` with your GitHub username or organization.
