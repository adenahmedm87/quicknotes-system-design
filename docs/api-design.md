# QuickNotes API Design

## Purpose

The API allows authenticated users to manage their own notes and organise
them with tags.

## Base URL

`http://localhost:3000/api`

A production service should use HTTPS.

## Endpoints

| Method | Endpoint | Purpose | Success status |
|---|---|---|---|
| POST | `/auth/login` | Authenticate a user | 200 |
| GET | `/notes` | List the current user's notes | 200 |
| POST | `/notes` | Create a note | 201 |
| GET | `/notes/{id}` | Retrieve one note | 200 |
| PATCH | `/notes/{id}` | Update a note | 200 |
| DELETE | `/notes/{id}` | Delete a note | 204 |
| GET | `/tags` | List tags | 200 |

## Create a note

Request: `POST /api/notes`

```json
{
  "title": "Study HTML",
  "content": "Practise semantic HTML.",
  "tags": ["study", "web-foundations"]
}
```

Expected response: `201 Created`

```json
{
  "id": "note-101",
  "title": "Study HTML",
  "content": "Practise semantic HTML.",
  "tags": ["study", "web-foundations"]
}
```

## Error status codes

- 400 Bad Request: invalid input.
- 401 Unauthorized: missing or invalid authentication.
- 403 Forbidden: insufficient permissions.
- 404 Not Found: requested resource does not exist.
- 500 Internal Server Error: unexpected server failure.

## Validation and security

- Require a title and validate its length.
- Validate note content and tag values on the server.
- Authenticate protected requests.
- Check that users can only access notes they own.
- Return consistent error responses.
- Never expose private API secrets in frontend code.

## Implementation note

This document specifies the expected API contract. The frontend client
requires a compatible backend; the backend is not included here.
