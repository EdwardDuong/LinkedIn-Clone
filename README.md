# LinkedIn Clone - Full Stack Application

A professional LinkedIn clone built with React, TypeScript, .NET 8, and PostgreSQL.

## Features

- User authentication (JWT + Google OAuth)
- Post creation and interactions (like, comment)
- Real-time messaging (SignalR)
- Connection requests
- Job postings and applications
- Image uploads (Cloudinary)
- Responsive design

## Tech Stack

### Frontend
- React 18
- TypeScript
- Redux Toolkit
- Styled Components
- Formik + Yup
- Socket.io Client

### Backend
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- SignalR
- JWT Authentication
- Clean Architecture (Domain, Application, Infrastructure, API)

### Infrastructure
- Docker (PostgreSQL)
- Cloudinary (Image storage)

---

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Git** - [Download here](https://git-scm.com/downloads)
2. **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop)
3. **.NET 8 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
4. **Node.js 18+** (LTS) - [Download here](https://nodejs.org/)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/EdwardDuong/LinkedIn-Clone.git
cd LinkedIn-Clone
```

---

### 2. Setup PostgreSQL Database (Docker)

**Start Docker Desktop first**, then run:

```bash
# Create and start PostgreSQL container
docker run -d \
  --name linkedin_postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=linkedin_clone \
  -p 5434:5432 \
  postgres:14-alpine

# Wait 5 seconds for PostgreSQL to initialize
# Then set the postgres user password
docker exec linkedin_postgres psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

**For Windows (PowerShell/CMD):**
```powershell
docker run -d --name linkedin_postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=linkedin_clone -p 5434:5432 postgres:14-alpine

timeout /t 5

docker exec linkedin_postgres psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

---

### 3. Apply Database Migrations

```bash
# Navigate to API project
cd server/LinkedIn.Api

# Generate SQL migration script
dotnet ef migrations script --output migration.sql --idempotent --project ../LinkedIn.Infrastructure

# Copy to container and execute
docker cp migration.sql linkedin_postgres:/tmp/migration.sql
docker exec linkedin_postgres sh -c "psql -U postgres -d linkedin_clone -f /tmp/migration.sql"

# Verify tables created (should show 20 tables)
docker exec linkedin_postgres psql -U postgres -d linkedin_clone -c "\dt"
```

**Expected Output:**
```
List of relations
 Schema |         Name          | Type  |  Owner
--------+-----------------------+-------+----------
 public | Users                 | table | postgres
 public | Posts                 | table | postgres
 public | Comments              | table | postgres
 ... (17 more tables)
(20 rows)
```

---

### 4. Configure Backend

Configuration files are already set up. Verify these settings:

**File: `server/LinkedIn.Api/appsettings.json`**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5434;Database=linkedin_clone;Username=postgres;Password=postgres"
  },
  "JwtSettings": {
    "Secret": "secret-jwt-key-min-32-characters-long-change-in-production",
    "Issuer": "LinkedInClone",
    "Audience": "LinkedInCloneUsers",
    "ExpirationInMinutes": 60,
    "RefreshTokenExpirationInDays": 7
  }
}
```

**File: `server/LinkedIn.Api/appsettings.Development.json`**
- Same connection string as above
- Development-specific JWT secret

**Note:** For production deployment, change the JWT secret to a secure random string.

---

### 5. Configure Frontend

Navigate to the client directory and create environment file:

```bash
cd ../../client
```

**Create `client/.env` file:**
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5265/api/v1
REACT_APP_SOCKET_URL=http://localhost:5265

# Google OAuth (optional - leave empty for now)
REACT_APP_GOOGLE_CLIENT_ID=

# Cloudinary (optional - leave empty for now)
REACT_APP_CLOUDINARY_CLOUD_NAME=
REACT_APP_CLOUDINARY_UPLOAD_PRESET=
```

---

### 6. Install Dependencies

**Backend:**
```bash
cd ../server/LinkedIn.Api
dotnet restore
```

**Frontend:**
```bash
cd ../../client
npm install
```

---

### 7. Run the Application

Open **two terminal windows**:

**Terminal 1 - Start Backend API:**
```bash
cd server/LinkedIn.Api
dotnet run --environment Development
```

You should see:
```
[INF] Starting LinkedIn Clone API
[INF] Now listening on: http://localhost:5265
[INF] Application started. Press Ctrl+C to shut down.
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
```

React will automatically open http://localhost:3000 in your browser.

---

### 8. Verify Everything Works

1. **API Health Check**: http://localhost:5265/health
   - Should display: `Healthy`

2. **Swagger UI**: http://localhost:5265
   - Interactive API documentation

3. **Frontend**: http://localhost:3000
   - LinkedIn Clone login page

4. **Database** (using DBeaver or any PostgreSQL client):
   - Host: `localhost`
   - Port: `5434`
   - Database: `linkedin_clone`
   - Username: `postgres`
   - Password: `postgres`

---

## Quick Start (After Initial Setup)

Once everything is installed and configured, starting the application is simple:

```bash
# 1. Start Docker Desktop

# 2. Start PostgreSQL (if not already running)
docker start linkedin_postgres

# 3. Start Backend (Terminal 1)
cd server/LinkedIn.Api
dotnet run

# 4. Start Frontend (Terminal 2)
cd client
npm start
```

---

## Project Structure

```
LinkedIn-Clone/
├── client/                          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── app/                    # Redux store configuration
│   │   ├── components/             # React components
│   │   │   ├── common/            # Reusable components
│   │   │   ├── Header/
│   │   │   ├── Home/
│   │   │   └── Login/
│   │   ├── features/              # Redux slices
│   │   │   ├── auth/
│   │   │   ├── posts/
│   │   │   └── ...
│   │   └── services/              # API services
│   ├── .env                       # Environment variables (create this)
│   └── package.json
│
├── server/                         # .NET backend
│   ├── LinkedIn.Api/              # Web API project
│   ├── LinkedIn.Application/      # Business logic (CQRS)
│   ├── LinkedIn.Domain/           # Domain entities
│   └── LinkedIn.Infrastructure/   # Data access, external services
│
└── README.md                      # This file
```

---

## API Endpoints

### Authentication
- `POST /api/v1/Auth/register` - Register new user
- `POST /api/v1/Auth/login` - Login user
- `POST /api/v1/Auth/refresh` - Refresh access token
- `POST /api/v1/Auth/logout` - Logout user

### Posts
- `GET /api/v1/Posts` - Get all posts (paginated)
- `POST /api/v1/Posts` - Create new post
- `PUT /api/v1/Posts/{id}` - Update post
- `DELETE /api/v1/Posts/{id}` - Delete post
- `POST /api/v1/Posts/{id}/like` - Like/unlike post
- `GET /api/v1/Posts/{id}/comments` - Get post comments
- `POST /api/v1/Posts/{id}/comments` - Add comment

**For complete API documentation, visit Swagger UI at http://localhost:5265**

---

## Database Schema

The application uses 20 tables:

### Core Tables
- **Users** - User profiles and authentication
- **Posts** - User posts/updates
- **Comments** - Post comments
- **PostLikes** - Post likes
- **CommentLikes** - Comment likes

### Social Features
- **Connections** - User connections/relationships
- **Messages** - Direct messages
- **Conversations** - Message threads
- **Notifications** - User notifications

### Professional Features
- **Jobs** - Job postings
- **JobApplications** - Job applications
- **UserExperiences** - Work experience
- **UserSkills** - User skills

### Identity (ASP.NET Core Identity)
- **Roles** - User roles
- **UserRoles** - User-role mappings
- **RoleClaims** - Role claims
- **UserClaims** - User claims
- **UserLogins** - External login providers
- **UserTokens** - Authentication tokens

### System
- **__EFMigrationsHistory** - EF Core migrations tracking

---

## Troubleshooting

### Port Already in Use

**Port 5434 (PostgreSQL):**
```bash
# Windows - Find process using port
netstat -ano | findstr :5434

# Kill process (replace PID with actual process ID)
taskkill /F /PID <PID>

# Or use a different port by updating connection strings
```

**Port 3000 (React):**
```bash
# Windows - Find and kill process
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Or React will prompt to use another port
```

**Port 5265 (API):**
```bash
# Stop the running API with Ctrl+C
# Or kill the process
netstat -ano | findstr :5265
taskkill /F /PID <PID>
```

---

### Database Connection Fails

**Check if PostgreSQL container is running:**
```bash
docker ps | grep linkedin_postgres
```

**If not running, start it:**
```bash
docker start linkedin_postgres
```

**If container doesn't exist, recreate it:**
```bash
# Remove old container if exists
docker rm linkedin_postgres

# Create new container
docker run -d --name linkedin_postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=linkedin_clone -p 5434:5432 postgres:14-alpine
```

**Test connection:**
```bash
docker exec linkedin_postgres psql -U postgres -d linkedin_clone -c "SELECT version();"
```

---

### API Returns 500 Error

**Check API logs in terminal for specific error**

**Common issues:**
1. Database not running → Start PostgreSQL container
2. AutoMapper version mismatch → Already fixed (v12.0.1)
3. Connection string incorrect → Verify port 5434 in appsettings.json

---

### React Compilation Errors

**Clear cache and reinstall:**
```bash
cd client
rm -rf node_modules
rm -rf .cache
npm install
npm start
```

**Check .env file exists:**
```bash
# Verify client/.env exists with correct values
cat .env  # Linux/Mac
type .env # Windows
```

---

### Docker Desktop Not Running

**Error:** `cannot connect to docker daemon`

**Solution:** Start Docker Desktop and wait for it to fully initialize (whale icon in system tray)

---

## Optional Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add to `client/.env`:
   ```env
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   ```

### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get credentials from dashboard
3. Add to `server/LinkedIn.Api/appsettings.Development.json`:
   ```json
   "CloudinarySettings": {
     "CloudName": "your_cloud_name",
     "ApiKey": "your_api_key",
     "ApiSecret": "your_api_secret"
   }
   ```
4. Add to `client/.env`:
   ```env
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

---

## Development Tools

### Recommended Extensions (VS Code)

- C# Dev Kit
- ESLint
- Prettier
- GitLens
- Docker
- PostgreSQL

### Database Management

- **DBeaver** (Free, cross-platform)
- **pgAdmin** (PostgreSQL official tool)
- **TablePlus** (macOS, Windows)

---

## Testing the Application

### 1. Register a New User

**Via Swagger UI (http://localhost:5265):**
1. Click on `POST /api/v1/Auth/register`
2. Click "Try it out"
3. Enter:
   ```json
   {
     "email": "test@example.com",
     "password": "Test@123",
     "confirmPassword": "Test@123",
     "firstName": "John",
     "lastName": "Doe"
   }
   ```
4. Click "Execute"
5. You should receive a JWT token

**Via Frontend (http://localhost:3000):**
1. Click "Register" or "Sign Up"
2. Fill in the registration form
3. Submit

### 2. Login

Use the credentials you just created to login and receive an access token.

### 3. Create a Post

1. Copy the access token from login response
2. In Swagger, click "Authorize" button
3. Enter: `Bearer <your_token>`
4. Test `POST /api/v1/Posts` endpoint

### 4. View in Database

Connect with DBeaver:
- Host: localhost
- Port: 5434
- Database: linkedin_clone
- Username: postgres
- Password: postgres

Query: `SELECT * FROM "Users";`

---

## Production Deployment

**Before deploying to production:**

1. Change JWT secret in `appsettings.json` to a secure random string
2. Enable HTTPS
3. Update CORS settings to allow only your frontend domain
4. Set strong PostgreSQL password
5. Use environment variables for sensitive data
6. Enable logging and monitoring
7. Setup CI/CD pipeline
8. Configure Cloudinary for production
9. Update connection strings for production database

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is for educational purposes.

---

## Contact

Edward Duong - [GitHub](https://github.com/EdwardDuong)

Project Link: [https://github.com/EdwardDuong/LinkedIn-Clone](https://github.com/EdwardDuong/LinkedIn-Clone)

---

## Acknowledgments

- React Documentation
- .NET Documentation
- PostgreSQL Documentation
- LinkedIn for inspiration
