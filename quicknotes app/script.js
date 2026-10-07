// These elements connect JavaScript to the controls and display areas in HTML.
const form = document.querySelector("#note-form");
const input = document.querySelector("#note-input");
const category = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const clearAllButton = document.querySelector("#clear-all-btn");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

const STORAGE_KEY = "quicknotes-project1";

let notes = loadNotes();

// Loads previously saved notes when the application starts.
function loadNotes() {
  const savedNotes = localStorage.getItem(STORAGE_KEY);

  return savedNotes ? JSON.parse(savedNotes) : [];
}

// Saves the current notes array in the browser.
function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// Rebuilds the note list whenever notes or the search changes.
function render() {
  notesList.replaceChildren();

  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredNotes = notes.filter((note) => {
    return note.text.toLowerCase().includes(searchTerm);
  });

  filteredNotes.forEach((note) => {
    const li = document.createElement("li");
    li.classList.add("note");

    const content = document.createElement("div");
    content.classList.add("note-content");

    const text = document.createElement("span");
    text.textContent = note.text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";
    deleteButton.dataset.id = note.id;

    // Deletes only the selected note.
    deleteButton.addEventListener("click", () => {
      deleteNote(note.id);
    });

    content.appendChild(text);
    content.appendChild(deleteButton);

    const categoryLabel = document.createElement("span");
    categoryLabel.textContent = note.category;
    categoryLabel.classList.add(
      "note-category",
      `category-${note.category}`
    );

    li.appendChild(content);
    li.appendChild(categoryLabel);

    notesList.appendChild(li);
  });

  updateCount();
}

// Updates the note count using correct singular/plural wording.
function updateCount() {
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}

// Creates a new note object and saves it.
function addNote(text, selectedCategory) {
  const newNote = {
    id: Date.now(),
    text: text,
    category: selectedCategory,
    createdAt: new Date().toISOString()
  };

  notes.push(newNote);

  saveNotes();
  render();
}

// Removes one note using its unique ID.
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);

  saveNotes();
  render();
}

// Handles note creation and validation.
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  errorMessage.textContent = "";

  if (text === "") {
    errorMessage.textContent = "Please enter a note.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent =
      "Your note must be 200 characters or less.";
    return;
  }

  addNote(text, category.value);

  input.value = "";
  input.focus();
});

// Updates the displayed notes as the user searches.
searchInput.addEventListener("input", () => {
  render();
});

// Deletes every note only after the user confirms.
clearAllButton.addEventListener("click", () => {
  const confirmed = confirm("Delete all notes?");

  if (!confirmed) {
    return;
  }

  notes = [];

  saveNotes();
  render();
});

// Displays saved notes when the application opens.
render();