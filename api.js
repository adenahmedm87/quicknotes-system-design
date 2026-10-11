const API_BASE_URL = "https://jsonplaceholder.typicode.com/posts";

async function request(url, options = {}) {
  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Network request failed. Check your internet connection.");
  }

  const status = response.status;
  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && data.message
        ? data.message
        : response.statusText || "Request failed";

    throw new Error(`HTTP ${status}: ${message}`);
  }

  return { data, status };
}

export function getNotes() {
  return request(`${API_BASE_URL}?_limit=10`);
}

export function createNote(note) {
  return request(API_BASE_URL, {
    method: "POST",
    body: JSON.stringify({
      title: note.title,
      body: note.body ?? "",
      userId: 1,
    }),
  });
}

export function deleteNote(id) {
  return request(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
