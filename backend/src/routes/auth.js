import { createToken, hashPassword, verifyPassword } from '../utils/auth';
import { createUser, getUserByEmail } from '../models/user';

export const handleAuth = {
  async login(request) {
    try {
      const { email, password } = await request.json();

      // Get user from DB
      const user = await getUserByEmail(request.env.DB, email);
      if (!user) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Verify password
      const valid = await verifyPassword(password, user.password_hash, request.env);
      if (!valid) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Create JWT token
      const token = await createToken({ userId: user.id, email: user.email }, request.env);

      return new Response(JSON.stringify({
        token,
        user: { id: user.id, email: user.email, name: user.name }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  async register(request) {
    try {
      const { email, password, name } = await request.json();

      // Check if user exists
      const existing = await getUserByEmail(request.env.DB, email);
      if (existing) {
        return new Response(JSON.stringify({ error: 'User already exists' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Hash password and create user
      const passwordHash = await hashPassword(password, request.env);
      const user = await createUser(request.env.DB, { email, passwordHash, name });

      const token = await createToken({ userId: user.id, email: user.email }, request.env);

      return new Response(JSON.stringify({
        token,
        user: { id: user.id, email: user.email, name: user.name }
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
