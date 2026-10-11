# QuickNotes Data Model

## Overview

A relational database is suitable for users, notes, and tags because the
entities have clear relationships and need data-integrity constraints.

## Users table

| Field | Type | Rules |
|---|---|---|
| id | INTEGER | Primary key |
| name | VARCHAR(100) | Required |
| email | VARCHAR(255) | Required, unique |
| password_hash | VARCHAR(255) | Required |
| created_at | TIMESTAMP | Creation time |

## Notes table

| Field | Type | Rules |
|---|---|---|
| id | INTEGER | Primary key |
| user_id | INTEGER | Foreign key to users |
| title | VARCHAR(100) | Required |
| content | TEXT | Note body |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

## Tags table

| Field | Type | Rules |
|---|---|---|
| id | INTEGER | Primary key |
| name | VARCHAR(50) | Required, unique |

## Note_tags table

| Field | Type | Rules |
|---|---|---|
| note_id | INTEGER | Foreign key to notes |
| tag_id | INTEGER | Foreign key to tags |

The pair `(note_id, tag_id)` is the composite primary key.

## Relationships

- One user can own many notes.
- Each note belongs to one user.
- A note can have many tags.
- A tag can be associated with many notes.
- `note_tags` implements the many-to-many relationship.

## Example SQL

```sql
SELECT id, title, content
FROM notes
WHERE user_id = 7
ORDER BY updated_at DESC;
```

This query retrieves the notes belonging to a specific user.

```sql
SELECT notes.title, tags.name
FROM notes
JOIN note_tags ON notes.id = note_tags.note_id
JOIN tags ON tags.id = note_tags.tag_id;
```

This query retrieves note titles and their associated tag names.

## Indexing

An index on `(user_id, updated_at)` can improve queries that retrieve
a user's notes ordered by update time.

## Data protection

Use parameterized SQL queries, validate inputs, enforce ownership checks,
and store password hashes rather than plain-text passwords.
