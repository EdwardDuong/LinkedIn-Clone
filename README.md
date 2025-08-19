# LinkedIn Clone - Full-Stack Application

A production-ready LinkedIn clone built with modern technologies including React, TypeScript, Node.js, Express, PostgreSQL, and Socket.io.

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Styled Components** - CSS-in-JS styling
- **Socket.io Client** - Real-time features
- **Axios** - HTTP client
- **Formik + Yup** - Form handling and validation

### Backend
- **Node.js + Express** - Server framework
- **TypeScript** - Type safety
- **PostgreSQL** - Relational database
- **Socket.io** - Real-time messaging
- **JWT** - Authentication
- **Passport.js** - Google OAuth
- **Cloudinary** - Media uploads
- **Redis** - Caching

## 📁 Project Structure

```
linkedin-clone/
├── client/              # React frontend
│   ├── src/
│   │   ├── app/         # Redux store
│   │   ├── features/    # Redux slices
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── types/       # TypeScript types
│   └── package.json
├── server/              # Node.js backend
│   ├── src/
│   │   ├── config/      # Configuration
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Express middleware
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── socket/      # Socket.io handlers
│   │   └── db/          # Database schema
│   └── package.json
├── shared/              # Shared TypeScript types
│   └── types/
└── docker-compose.yml   # Database containers
```

## 🛠️ Getting Started

### Prerequisites
- Node.js v18+
- Docker & Docker Compose
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

2. **Setup environment variables**
   - Copy `server/.env.example` to `server/.env`
   - Copy `client/.env.example` to `client/.env.local`
   - Update with your credentials

3. **Start Docker containers**
   ```bash
   npm run docker:up
   ```

4. **Run development servers**
   ```bash
   npm run dev
   ```

Client: http://localhost:3000
Server: http://localhost:5000
pgAdmin: http://localhost:5050 (admin@admin.com / admin)

## 📦 Scripts

```bash
npm run dev              # Run client and server concurrently
npm run client           # Run client only
npm run server           # Run server only
npm run docker:up        # Start Docker containers
npm run docker:down      # Stop Docker containers
npm run build            # Build both client and server
```

## ✨ Features

### Completed ✅
- [x] Monorepo structure with workspaces
- [x] TypeScript configuration
- [x] PostgreSQL database schema
- [x] Express server setup
- [x] Shared type definitions
- [x] Docker setup (PostgreSQL + Redis + pgAdmin)

### In Progress 🚧
- [ ] JWT authentication
- [ ] Google OAuth 2.0
- [ ] User profiles
- [ ] Posts CRUD
- [ ] Real-time messaging
- [ ] Image uploads
- [ ] Job postings

### Planned 📋
- [ ] Testing suite
- [ ] Performance optimization
- [ ] CI/CD pipeline
- [ ] Production deployment

## 🗄️ Database Schema

Main tables:
- **users** - User accounts and profiles
- **posts** - User posts with media
- **comments** - Post comments
- **connections** - User network
- **jobs** - Job postings
- **job_applications** - Applications
- **messages** - Direct messaging
- **notifications** - Activity notifications

## 📚 API Endpoints (Planned)

```
Auth:     POST /api/v1/auth/register, /login, /refresh
Users:    GET  /api/v1/users/me, /:id
Posts:    GET  /api/v1/posts, POST /posts
Jobs:     GET  /api/v1/jobs, POST /jobs
Messages: GET  /api/v1/messages, POST /messages
```

## 🔐 Environment Variables

### Server (.env)
```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/linkedin_clone
JWT_SECRET=your_secret_32_chars_minimum
GOOGLE_CLIENT_ID=your_google_client_id
CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Client (.env.local)
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## 📝 Development Guidelines

- Use TypeScript strict mode
- Follow ESLint rules
- Use functional components
- Write meaningful commit messages
- Test before committing

## 🚀 Deployment

1. Build: `npm run build`
2. Deploy client to Vercel/Netlify
3. Deploy server to Railway/Render
4. Configure production environment variables
5. Run database migrations

## 📄 License

MIT License

## 👨‍💻 Author

**Edward Duong**

---

**Status**: Active Development 🚀
