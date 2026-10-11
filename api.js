// Change this URL if your backend uses a different address.
const API_BASE_URL = "http://localhost:3000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getNotes() {
  return request("/notes");
}

export function createNote(note) {
  return request("/notes", {
    method: "POST",
    body: JSON.stringify(note),
  });
}

export function updateNote(id, changes) {
  return request(`/notes/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export function deleteNote(id) {
  return request(`/notes/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function getTags() {
  return request("/tags");
}
