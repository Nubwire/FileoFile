export async function getDocuments(db, userId) {
  const result = await db.prepare(
    'SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC'
  ).bind(userId).all();
  return result.results;
}

export async function getDocument(db, id, userId) {
  const result = await db.prepare(
    'SELECT * FROM documents WHERE id = ? AND user_id = ?'
  ).bind(id, userId).first();
  return result;
}

export async function createDocument(db, { userId, title, description, fileName, fileSize, fileType, fileKey }) {
  const result = await db.prepare(
    `INSERT INTO documents
     (user_id, title, description, file_name, file_size, file_type, file_key)
     VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`
  ).bind(userId, title, description, fileName, fileSize, fileType, fileKey).first();
  return result;
}

export async function updateDocument(db, id, userId, { title, description }) {
  const result = await db.prepare(
    'UPDATE documents SET title = ?, description = ? WHERE id = ? AND user_id = ? RETURNING *'
  ).bind(title, description, id, userId).first();
  return result;
}

export async function deleteDocument(db, id, userId) {
  await db.prepare(
    'DELETE FROM documents WHERE id = ? AND user_id = ?'
  ).bind(id, userId).run();
}
