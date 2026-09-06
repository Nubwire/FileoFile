export async function getUserByEmail(db, email) {
  const result = await db.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(email).first();
  return result;
}

export async function getUserById(db, id) {
  const result = await db.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(id).first();
  return result;
}

export async function createUser(db, { email, passwordHash, name }) {
  const result = await db.prepare(
    'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?) RETURNING *'
  ).bind(email, passwordHash, name).first();
  return result;
}
