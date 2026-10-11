# QuickNotes API Design

## Purpose

This project demonstrates frontend communication with the public
JSONPlaceholder mock API. It uses HTTP requests to retrieve, create, and
delete posts without requiring a custom backend.

## Base URL

`https://jsonplaceholder.typicode.com/posts`

## Endpoints used by the frontend

| Method | Endpoint | Purpose | Expected success status |
|---|---|---|---|
| GET | `/posts?_limit=10` | Load up to ten sample posts | 200 OK |
| POST | `/posts` | Submit a new post | 201 Created |
| DELETE | `/posts/{id}` | Request deletion of a post | 200 OK |

The browser sends requests directly to the public service. The frontend
displays errors when a request fails.

## Listing notes

Request:

`GET https://jsonplaceholder.typicode.com/posts?_limit=10`

Expected status: `200 OK`

Example response:

```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "sample note title",
    "body": "sample note body"
  },
  {
    "userId": 1,
    "id": 2,
    "title": "another note title",
    "body": "another note body"
  }
]
```

## Creating a note

Request:

`POST https://jsonplaceholder.typicode.com/posts`

The title is required by the frontend. The body is optional and is sent
as an empty string when omitted. The frontend supplies `userId: 1`.

Example request:

```json
{
  "title": "Study HTML",
  "body": "",
  "userId": 1
}
```

Expected status: `201 Created`

Example response:

```json
{
  "title": "Study HTML",
  "body": "",
  "userId": 1,
  "id": 101
}
```

The returned ID is an illustrative example. The actual response supplies
the ID displayed by the application.

After a successful response, the frontend inserts the returned post into
its displayed list and reports the HTTP status and new ID.

## Deleting a note

Request:

`DELETE https://jsonplaceholder.typicode.com/posts/1`

Expected status: `200 OK`

The frontend removes the selected note from its local displayed list
after a successful response.

## Example error payload

A service may return an error response such as:

```json
{
  "message": "The requested resource was not found."
}
```

This is an illustrative error payload, not a guarantee that
JSONPlaceholder returns this exact body for every error. The client also
reports the HTTP status code and status text where available.

Common HTTP statuses include:

- `200 OK`: the request succeeded.
- `201 Created`: a resource was created by the request.
- `400 Bad Request`: the request contains invalid input.
- `404 Not Found`: the requested resource was not found.
- `500 Internal Server Error`: an unexpected server error occurred.

## Mock API limitation

JSONPlaceholder simulates writes. A successful POST returns a response
with an ID, but the new post is not permanently stored on the service.
A DELETE response likewise does not permanently change the remote data.
The frontend updates its local display after successful requests.

## Validation and security

- Require a non-empty title in the frontend.
- Permit an empty body.
- Use `textContent` to display API-provided text safely.
- Check response status codes and handle network failures.
- A production application would require server-side authentication,
  authorization, persistent storage, and validation.
