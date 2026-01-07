# Read Pulse

A Fastify v5 project with Zod schema validation.

## Requirements

- **Node.js**: v20.0.0 or higher
- **Fastify**: v5.0.0
- **Zod**: For JSON schema validation (required by Fastify v5)

## Installation

```bash
npm install
```

## Development

Start the development server with auto-reload:

```bash
npm run dev
```

Or start the production server:

```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## Environment Variables

- `PORT`: Server port (default: 3000)
- `HOST`: Server host (default: 0.0.0.0)

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID (UUID required)
- `POST /api/users` - Create a new user
  - Body: `{ "name": "string", "email": "string", "age": number (optional) }`

## Project Structure

```
read-pulse/
├── src/
│   ├── server.js          # Main server file
│   └── routes/
│       └── example.js     # Example routes with Zod validation
├── package.json
└── README.md
```

## Features

- ✅ Fastify v5 with strict schema validation
- ✅ Zod integration for type-safe schemas
- ✅ ES Modules (ESM) support
- ✅ Request/response validation
- ✅ Structured logging
- ✅ Health check endpoint

## License

MIT

