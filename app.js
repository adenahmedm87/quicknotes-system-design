import { getNotes, createNote, deleteNote } from "./api.js";

const form = document.querySelector("#note-form");
const titleInput = document.querySelector("#note-title");
const contentInput = document.querySelector("#note-content");
const tagsInput = document.querySelector("#note-tags");
const createButton = document.querySelector("#create-button");
const refreshButton = document.querySelector("#refresh-button");
const statusElement = document.querySelector("#status");
const notesList = document.querySelector("#notes-list");

function setStatus(message) {
  statusElement.textContent = message;
}

function renderNotes(notes) {
  notesList.replaceChildren();

  if (!Array.isArray(notes)) {
    setStatus("The API did not return a valid notes list.");
    return;
  }

  if (notes.length === 0) {
    setStatus("No notes found. Create your first note.");
    return;
  }

  for (const note of notes) {
    const item = document.createElement("li");
    item.className = "note";

    const title = document.createElement("h3");
    title.textContent = note.title ?? "Untitled note";

    const content = document.createElement("p");
    content.textContent = note.content ?? "";

    const tags = document.createElement("p");
    tags.className = "note-tags";

    const tagNames = Array.isArray(note.tags) ? note.tags : [];
    tags.textContent = tagNames.length
      ? `Tags: ${tagNames.join(", ")}`
      : "No tags";

    item.append(title, content, tags);

    if (note.id !== undefined && note.id !== null) {
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-button";
      deleteButton.textContent = "Delete";

      deleteButton.addEventListener("click", async () => {
        if (!window.confirm("Delete this note?")) return;

        deleteButton.disabled = true;
        setStatus("Deleting note...");

        try {
          await deleteNote(note.id);
          await loadNotes();
          setStatus("Note deleted successfully.");
        } catch (error) {
          setStatus(error.message);
          deleteButton.disabled = false;
        }
      });

      item.append(deleteButton);
    }

    notesList.append(item);
  }

  setStatus(`${notes.length} note(s) loaded.`);
}

async function loadNotes() {
  refreshButton.disabled = true;
  setStatus("Loading notes...");

  try {
    const result = await getNotes();
    const notes = Array.isArray(result) ? result : result.notes;
    renderNotes(notes);
  } catch (error) {
    setStatus(
      `${error.message}. Check that your backend is running at the URL in api.js.`
    );
  } finally {
    refreshButton.disabled = false;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const tags = tagsInput.value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (!title || !content) {
    setStatus("Please enter both a title and note content.");
    return;
  }

  createButton.disabled = true;
  setStatus("Creating note...");

  try {
    await createNote({ title, content, tags });
    form.reset();
    await loadNotes();
    setStatus("Note created successfully.");
  } catch (error) {
    setStatus(
      `${error.message}. Check that your backend is running at the URL in api.js.`
    );
  } finally {
    createButton.disabled = false;
  }
});

refreshButton.addEventListener("click", loadNotes);

loadNotes();
