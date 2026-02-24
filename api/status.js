export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  res.status(200).json({
    success: true,
    data: {
      connector: 'file',
      status: 'running',
      max_file_size: parseInt(process.env.MAX_FILE_SIZE) || 5242880,
      timestamp: new Date().toISOString(),
    },
  });
}
