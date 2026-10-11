import { getNotes, createNote, deleteNote } from "./api.js";

const form = document.querySelector("#note-form");
const titleInput = document.querySelector("#title-input");
const bodyInput = document.querySelector("#body-input");
const submitButton = document.querySelector("#submit-btn");
const loadButton = document.querySelector("#load-btn");
const statusElement = document.querySelector("#status");
const notesList = document.querySelector("#notes-list");

let notes = [];

function setStatus(message) {
  statusElement.textContent = message;
}

function renderNotes() {
  notesList.replaceChildren();

  if (notes.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No notes to display. Create a note or load notes.";
    notesList.append(emptyItem);
    return;
  }

  for (const note of notes) {
    const item = document.createElement("li");
    item.className = "note";

    const title = document.createElement("h3");
    title.textContent = note.title || "Untitled note";

    const body = document.createElement("p");
    body.textContent = note.body || "No content provided.";

    const user = document.createElement("p");
    user.className = "note-tags";
    user.textContent = `User ID: ${note.userId ?? "Unknown"} | Note ID: ${note.id}`;

    item.append(title, body, user);

    if (note.id !== undefined && note.id !== null) {
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-button";
      deleteButton.textContent = "Delete";

      deleteButton.addEventListener("click", async () => {
        if (!window.confirm("Delete this note from the displayed list?")) {
          return;
        }

        deleteButton.disabled = true;
        setStatus(`Deleting note ${note.id}...`);

        try {
          const result = await deleteNote(note.id);

          // JSONPlaceholder simulates deletion; update our local list too.
          notes = notes.filter((item) => item.id !== note.id);
          renderNotes();

          setStatus(
            `Note ${note.id} removed from the displayed list. HTTP ${result.status}.`
          );
        } catch (error) {
          setStatus(error.message);
          deleteButton.disabled = false;
        }
      });

      item.append(deleteButton);
    }

    notesList.append(item);
  }
}

async function loadNotes() {
  loadButton.disabled = true;
  setStatus("Loading notes from JSONPlaceholder...");

  try {
    const result = await getNotes();

    if (!Array.isArray(result.data)) {
      throw new Error("The API did not return a valid list of notes.");
    }

    notes = result.data;
    renderNotes();
    setStatus(`Loaded ${notes.length} notes. HTTP ${result.status}.`);
  } catch (error) {
    setStatus(`Could not load notes: ${error.message}`);
  } finally {
    loadButton.disabled = false;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title) {
    setStatus("Please enter a title. The content is optional.");
    titleInput.focus();
    return;
  }

  submitButton.disabled = true;
  setStatus("Sending your note to JSONPlaceholder...");

  try {
    const result = await createNote({ title, body });
    const newNote = result.data;

    if (!newNote || newNote.id === undefined) {
      throw new Error("The API response did not contain a new note ID.");
    }

    // JSONPlaceholder does not permanently save posts.
    // Add the returned post locally so it appears immediately.
    notes = [newNote, ...notes];
    renderNotes();
    form.reset();

    setStatus(
      `Note created successfully. HTTP ${result.status}. New note ID: ${newNote.id}.`
    );
  } catch (error) {
    setStatus(`Could not create note: ${error.message}`);
  } finally {
    submitButton.disabled = false;
  }
});

loadButton.addEventListener("click", loadNotes);

loadNotes();
