# QuickNotes System Design

## Overview

QuickNotes is a notes client that demonstrates HTTP communication with a
public API, relational data modelling, and scalable system architecture.

## Features

- Load sample posts using GET.
- Submit a post using POST.
- Request deletion using DELETE.
- Display loading, success, and error messages.
- Require a title while allowing an optional body.
- Safely display text using DOM element creation and `textContent`.
- Document the API, database model, and architecture.

## Project structure

- `index.html` — user interface and required form controls.
- `style.css` — page styling.
- `app.js` — form handling, rendering, and local UI updates.
- `api.js` — HTTP requests to JSONPlaceholder.
- `docs/api-design.md` — [API design](docs/api-design.md).
- `docs/data-model.md` — [Data model](docs/data-model.md).
- `docs/architecture.md` — [Architecture and scaling](docs/architecture.md).

## Running the project

1. Clone or download this repository.
2. Open the project folder in VS Code.
3. Open `index.html` using VS Code Live Server.
4. Make sure you have an internet connection.
5. Click **Load / Refresh notes** to retrieve sample posts.
6. Enter a title and optionally enter content, then click **Create note**.
7. Use a note's Delete button to test the DELETE request.

No custom backend or local server on port 3000 is required. The browser
communicates with `https://jsonplaceholder.typicode.com/posts`.

## Important API limitation

JSONPlaceholder is a mock API. POST and DELETE requests simulate writes;
they do not permanently change the remote posts. This frontend therefore
updates its displayed list locally after successful create and delete
requests. Reloading the page retrieves the service's sample data again.

## What I Learned

I learned how a frontend communicates with an HTTP API using GET, POST,
and DELETE requests. I learned to inspect HTTP status codes, handle network
errors, send JSON request bodies, and update the interface after a
successful response. I also learned that a mock API can simulate creating
and deleting resources without permanently storing those changes.

The database design helped me understand primary keys, foreign keys, and
many-to-many relationships through a join table. The architecture
document helped me connect traffic estimates to caching, load balancing,
read replicas, and other scaling decisions. I also learned why a cache
must not be treated as the final authority for data that requires
correctness.

## Security

The interface uses `textContent` instead of inserting API text as HTML.
A production service would also require HTTPS, authentication,
authorization, server-side validation, and persistent storage.
