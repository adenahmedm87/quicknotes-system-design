# QuickNotes System Design

## Overview

QuickNotes is a notes application project demonstrating REST API
communication, relational data modelling, and scalable system architecture.

## Features

- Load notes from an API.
- Create notes.
- Delete notes.
- Display loading and error messages.
- Validate user input.
- Document API endpoints and data relationships.

## Project structure

- `index.html` — user interface.
- `style.css` — page styling.
- `app.js` — connects the interface to the API client.
- `api.js` — handles HTTP requests.
- `docs/api-design.md` — REST API design.
- `docs/data-model.md` — database schema and relationships.
- `docs/architecture.md` — system architecture and scaling.

## Running the project

1. Open this folder in VS Code.
2. Open `api.js`.
3. Confirm that `API_BASE_URL` matches your backend.
4. Start your backend API server.
5. Open `index.html` through VS Code Live Server.

The frontend expects a backend at `http://localhost:3000/api` by default.

## Important limitation

This repository contains a frontend API client and design documentation.
It does not include a working backend or database. Live API operations will
work only when a compatible backend is running.

## Security

Never put passwords or private API secrets in frontend code.
Production deployments should use HTTPS and server-side authorization.
