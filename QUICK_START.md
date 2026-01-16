# 🚀 Quick Start Guide

## Prerequisites

- **Node.js** 18+ 
- **npm** 8+ or **yarn** 1.22+
- **MySQL** 8.0+ or **PostgreSQL** 13+
- **Redis** 6.0+ (optional, for caching)
- **Docker** & **Docker Compose** (optional, for containerized setup)

## 📋 Installation Steps

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd 3D-PC-Maker-Emulator

# Install all dependencies (root + client + server)
npm run setup

# Or install manually:
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### 2. Environment Configuration

```bash
# Copy environment files
cp client/.env.example client/.env
cp server/.env.example server/.env

# Edit the files with your configuration
nano client/.env
nano server/.env
```

### 3. Database Setup

#### Option A: Local Database
```bash
# Create database
mysql -u root -p
CREATE DATABASE pc_builder_3d;

# Run migrations (when implemented)
cd server
npm run migrate

# Seed database (optional)
npm run seed
```

#### Option B: Docker Database
```bash
# Start database services
npm run docker:db

# This starts MySQL and Redis containers
```

### 4. Start Development Servers

```bash
# Start both client and server in development mode
npm run dev

# Or start individually:
npm run dev:client  # Frontend on http://localhost:3000
npm run dev:server  # Backend API on http://localhost:5000
```

### 5. Docker Setup (Optional)

```bash
# Start all services with Docker
npm run docker:up

# This starts:
# - Frontend (React + Vite)
# - Backend (Node.js + Express)  
# - MySQL Database
# - Redis Cache
# - MinIO (S3-compatible storage)

# Stop all services
npm run docker:down

# View logs
npm run docker:logs
```

## 🔧 Configuration

### Client Environment (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_AWS_S3_BUCKET=pc-builder-3d-models
VITE_ENABLE_SHADOWS=true
VITE_ENABLE_ANTIALIAS=true
VITE_PIXEL_RATIO=2
```

### Server Environment (.env)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=pc_builder_3d
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
```

## 📁 Project Structure

```
3D-PC-Maker-Emulator/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── assets/        # Static assets
│   └── public/            # Public files
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── services/      # Business logic
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── config/        # Configuration files
│   │   └── utils/         # Utility functions
│   └── tests/             # Test files
├── docs/                  # Documentation
├── .github/               # GitHub workflows
└── docker-compose.yml     # Docker configuration
```

## 🎯 Available Scripts

### Root Scripts
```bash
npm run dev          # Start both client and server
npm run build        # Build both for production
npm run test         # Run all tests
npm run lint         # Lint all code
npm run docker:up    # Start Docker containers
npm run docker:down  # Stop Docker containers
```

### Client Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

### Server Scripts
```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Run ESLint
npm run migrate      # Run database migrations
npm run seed         # Seed database
```

## 🌐 Access Points

After starting the development servers:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/docs
- **Database**: localhost:3306 (MySQL)
- **Redis**: localhost:6379
- **MinIO Console**: http://localhost:9001 (if using Docker)

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill processes on ports 3000 and 5000
   npx kill-port 3000 5000
   ```

2. **Database connection failed**
   ```bash
   # Check MySQL service
   sudo systemctl status mysql
   
   # Or restart with Docker
   npm run docker:down && npm run docker:up
   ```

3. **Module not found errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules client/node_modules server/node_modules
   npm run setup
   ```

4. **Permission issues**
   ```bash
   # Fix npm permissions
   sudo chown -R $(whoami) ~/.npm
   sudo chown -R $(whoami) node_modules
   ```

5. **TypeScript errors**
   ```bash
   # Check TypeScript configuration
   npm run type-check
   
   # Update types
   npm install --save-dev @types/node @types/express
   ```

### Getting Help

- Check the [README.md](./README.md) for detailed documentation
- Review [API Documentation](http://localhost:5000/api/docs)
- Check logs in `server/logs/` directory
- Enable debug mode: `DEBUG=* npm run dev`

## 🚀 Next Steps

1. **Explore the Application**
   - Browse the component catalog
   - Try building your first PC
   - Test the 3D viewer (when implemented)

2. **Development**
   - Add new components to the database
   - Create custom 3D models
   - Implement new features

3. **Deployment**
   - Configure production environment
   - Set up CI/CD pipeline
   - Deploy to cloud provider

Happy coding! 🎉
