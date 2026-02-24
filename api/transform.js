export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content, from, to } = req.body;
  if (!content || !from || !to) {
    return res.status(400).json({ success: false, error: 'content, from, and to are required' });
  }

  try {
    let result;
    if (from === 'json' && to === 'csv') {
      const data = typeof content === 'string' ? JSON.parse(content) : content;
      if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ success: false, error: 'JSON must be an array of objects' });
      }
      const headers = Object.keys(data[0]);
      const rows = data.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(','));
      result = [headers.join(','), ...rows].join('\n');
    } else if (from === 'csv' && to === 'json') {
      const lines = content.trim().split('\n');
      const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
      result = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
        return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
      });
    } else {
      return res.status(400).json({ success: false, error: `Unsupported transformation: ${from} -> ${to}` });
    }

    res.status(200).json({ success: true, data: { result, from, to } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Transform failed: ' + error.message });
  }
}
