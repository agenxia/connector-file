// In-memory file store (ephemeral — resets on cold start)
const store = new Map();

export default async function handler(req, res) {
  const { method, query } = req;
  const path = query.path;

  if (method === 'GET' && !path) {
    // List all files
    const files = Array.from(store.entries()).map(([p, data]) => ({
      path: p,
      size: data.content.length,
      type: data.type,
      created_at: data.created_at,
    }));
    return res.status(200).json({ success: true, data: { files, total: files.length } });
  }

  if (method === 'GET' && path) {
    // Read file
    const file = store.get(path);
    if (!file) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    return res.status(200).json({ success: true, data: file });
  }

  if (method === 'POST' || method === 'PUT') {
    // Write file
    if (!path) {
      return res.status(400).json({ success: false, error: 'path query param is required' });
    }
    const { content, type = 'text/plain' } = req.body;
    if (content === undefined) {
      return res.status(400).json({ success: false, error: 'content is required' });
    }
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 5242880;
    const size = typeof content === 'string' ? content.length : JSON.stringify(content).length;
    if (size > maxSize) {
      return res.status(413).json({ success: false, error: `File exceeds max size (${maxSize} bytes)` });
    }
    const isNew = !store.has(path);
    store.set(path, { path, content, type, size, created_at: new Date().toISOString() });
    return res.status(isNew ? 201 : 200).json({ success: true, data: { path, size, action: isNew ? 'created' : 'updated' } });
  }

  if (method === 'DELETE' && path) {
    const existed = store.delete(path);
    return res.status(200).json({ success: true, data: { path, deleted: existed } });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
