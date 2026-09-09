import { Router } from 'itty-router';
import { authMiddleware } from './middleware/auth';
import { handleAuth } from './routes/auth';
import { handleDocuments } from './routes/documents';
import { handleUsers } from './routes/users';

const router = Router();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function withCors(response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Handle CORS preflight requests
router.options('*', () => new Response(null, { status: 204, headers: corsHeaders }));

// Public routes
router.post('/api/auth/login', handleAuth.login);
router.post('/api/auth/register', handleAuth.register);

// Protected routes
router.get('/api/documents/:id/download', authMiddleware, handleDocuments.download);
router.get('/api/documents', authMiddleware, handleDocuments.GET);
router.get('/api/documents/:id', authMiddleware, handleDocuments.GET);
router.post('/api/documents', authMiddleware, handleDocuments.POST);
router.put('/api/documents/:id', authMiddleware, handleDocuments.PUT);
router.delete('/api/documents/:id', authMiddleware, handleDocuments.DELETE);

router.get('/api/users', authMiddleware, handleUsers.GET);
router.get('/api/users/:id', authMiddleware, handleUsers.GET);

// Health check
router.get('/api/health', () => new Response('OK', { status: 200 }));

// Catch all
router.all('*', () => new Response('Not Found', { status: 404 }));

export default {
  async fetch(request, env, ctx) {
    // Inject env into request context
    request.env = env;
    const response = await router.handle(request);
    return withCors(response);
  }
};
