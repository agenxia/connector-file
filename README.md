# File Connector

Read, write, list, and transform files via a simple API.

## Endpoints

- `GET /api/files` — List all files
- `GET /api/files?path=foo.txt` — Read a file
- `POST /api/files?path=foo.txt` — Write a file
- `DELETE /api/files?path=foo.txt` — Delete a file
- `POST /api/transform` — Transform data (json<->csv)
- `GET /api/status` — Connector health

## Environment Variables

| Variable | Description |
|----------|-------------|
| MAX_FILE_SIZE | Max file size in bytes (default: 5MB) |

## Notes

Storage is in-memory (ephemeral). Files are lost on cold start.
For persistent storage, connect to an external service.
