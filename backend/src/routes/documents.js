import {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument
} from '../models/document';

export const handleDocuments = {
  async download(request) {
    try {
      const url = new URL(request.url);
      const parts = url.pathname.split('/').filter(Boolean);
      // path shape: api / documents / :id / download
      const id = parts[2];

      const document = await getDocument(request.env.DB, id, request.user.userId);
      if (!document) {
        return new Response(JSON.stringify({ error: 'Document not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const object = await request.env.FILES.get(document.file_key);
      if (!object) {
        return new Response(JSON.stringify({ error: 'File missing from storage' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const headers = new Headers();
      headers.set('Content-Type', document.file_type || 'application/octet-stream');
      headers.set('Content-Disposition', `attachment; filename="${document.file_name}"`);
      headers.set('Content-Length', String(document.file_size));

      return new Response(object.body, { status: 200, headers });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  async GET(request) {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();

      if (id && id !== 'documents') {
        const document = await getDocument(request.env.DB, id, request.user.userId);
        if (!document) {
          return new Response(JSON.stringify({ error: 'Document not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return new Response(JSON.stringify(document), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const documents = await getDocuments(request.env.DB, request.user.userId);
      return new Response(JSON.stringify(documents), {
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

  async POST(request) {
    try {
      const formData = await request.formData();
      const file = formData.get('file');
      const title = formData.get('title');
      const description = formData.get('description');

      if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Upload to R2
      const key = `${request.user.userId}/${Date.now()}-${file.name}`;
      await request.env.FILES.put(key, file.stream(), {
        httpMetadata: {
          contentType: file.type,
          contentDisposition: `inline; filename="${file.name}"`
        }
      });

      // Save metadata to D1
      const document = await createDocument(request.env.DB, {
        userId: request.user.userId,
        title: title || file.name,
        description: description || '',
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileKey: key
      });

      return new Response(JSON.stringify(document), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  async PUT(request) {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();
      const data = await request.json();

      const document = await updateDocument(request.env.DB, id, request.user.userId, data);
      if (!document) {
        return new Response(JSON.stringify({ error: 'Document not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify(document), {
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

  async DELETE(request) {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();

      const document = await getDocument(request.env.DB, id, request.user.userId);
      if (!document) {
        return new Response(JSON.stringify({ error: 'Document not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Delete from R2
      await request.env.FILES.delete(document.file_key);

      // Delete from D1
      await deleteDocument(request.env.DB, id, request.user.userId);

      return new Response(null, {
        status: 204
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
