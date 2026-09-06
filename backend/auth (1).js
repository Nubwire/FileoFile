import { SignJWT, jwtVerify } from 'jose';

// NOTE: Cloudflare Workers don't have `process.env` by default.
// Set JWT_SECRET and PASSWORD_SALT as Worker secrets:
//   npx wrangler secret put JWT_SECRET
//   npx wrangler secret put PASSWORD_SALT
// and pass `env` through from the request handler into these functions.

function getSecretKey(env) {
  const secret = (env && env.JWT_SECRET) || 'dev-secret-change-this';
  return new TextEncoder().encode(secret);
}

export async function createToken(payload, env) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(getSecretKey(env));
  return token;
}

export async function verifyToken(token, env) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(env));
    return payload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password, env) {
  const salt = (env && env.PASSWORD_SALT) || 'dev-salt-change-this';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

export async function verifyPassword(password, hash, env) {
  const newHash = await hashPassword(password, env);
  return newHash === hash;
}
