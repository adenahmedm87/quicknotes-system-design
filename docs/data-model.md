# QuickNotes Data Model

## Overview

A relational database is suitable for users, notes, and tags because these
entities have clear relationships and require data-integrity constraints.

The SQL below uses PostgreSQL syntax. It documents the proposed production

The API uses the field name `body` for note text, while this database model
stores the same information in the `content` column of the `notes` table.
data model; the frontend currently uses JSONPlaceholder rather than this
database.

## Executable table definitions

Create the parent tables before the tables that reference them.

### 1. Users

```sql
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Notes

The body is optional, so `content` may be NULL.

```sql
CREATE TABLE notes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Tags

```sql
CREATE TABLE tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);
```

### 4. Note_tags

This join table implements the many-to-many relationship between notes
and tags.

```sql
CREATE TABLE note_tags (
    note_id BIGINT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);
```

## Relationships

- One user can own many notes.
- Each note belongs to one user.
- A note can have many tags.
- A tag can belong to many notes.
- `note_tags` connects notes and tags.
- Foreign keys preserve relationships; primary and unique keys prevent
  duplicate identifiers.

## Example queries

### Query 1: List a user's notes

```sql
SELECT id, title, content, created_at, updated_at
FROM notes
WHERE user_id = 7
ORDER BY updated_at DESC;
```

This returns notes belonging to user 7, newest updates first.

### Query 2: List notes and their tags

```sql
SELECT notes.title, tags.name AS tag_name
FROM notes
JOIN note_tags ON notes.id = note_tags.note_id
JOIN tags ON tags.id = note_tags.tag_id
ORDER BY notes.title;
```

This returns each note title with its associated tag.

### Query 3: Count notes per user

```sql
SELECT users.id, users.name, COUNT(notes.id) AS note_count
FROM users
LEFT JOIN notes ON notes.user_id = users.id
GROUP BY users.id, users.name
ORDER BY note_count DESC;
```

This counts each user's notes, including users who have no notes.

## Indexing

```sql
CREATE INDEX idx_notes_user_updated
ON notes (user_id, updated_at DESC);
```

This index helps retrieve one user's notes in update order.

## Data protection

Use parameterized SQL, validate inputs, enforce ownership checks, and store
password hashes rather than plain-text passwords.
