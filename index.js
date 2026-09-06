import { Router } from 'itty-router';
import { authMiddleware } from './middleware/auth';
import { handleAuth } from './routes/auth';
import { handleDocuments } from './routes/documents';
import { handleUsers } from './routes/users';

const router = Router();

// Public routes
router.post('/api/auth/login', handleAuth.login);
router.post('/api/auth/register', handleAuth.register);

// Protected routes
router.all('/api/documents/*', authMiddleware, handleDocuments);
router.all('/api/users/*', authMiddleware, handleUsers);

// Health check
router.get('/api/health', () => new Response('OK', { status: 200 }));

// Catch all
router.all('*', () => new Response('Not Found', { status: 404 }));

export default {
  async fetch(request, env, ctx) {
    // Inject env into request context
    request.env = env;
    return router.handle(request);
  }
};
