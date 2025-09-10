# 🌍 Global Expansion Management API

A NestJS backend for managing global expansion projects, connecting structured data (MySQL) with unstructured research documents (MongoDB).

## 🚀 Features

- **JWT Authentication** with role-based access (Admin/Client)
- **Dual Database System**: MySQL + MongoDB
- **Project-Vendor Matching Algorithm**
- **Cross-Database Analytics**
- **Scheduled Tasks & Notifications**
- **Dockerized Deployment**

## 🛠️ Tech Stack

- **Framework**: NestJS with TypeScript
- **Databases**: MySQL + MongoDB
- **Authentication**: JWT with Passport
- **ORM**: TypeORM (MySQL) + Mongoose (MongoDB)
- **Scheduling**: NestJS Schedule
- **Containerization**: Docker + Docker Compose

## 📊 Database Schema

### MySQL Entities

- `clients` - Company clients
- `projects` - Expansion projects
- `vendors` - Service providers
- `matches` - Project-vendor matches

### MongoDB Collections

- `research` - Unstructured research documents

## 🎯 Matching Algorithm

**Score Formula**: `services_overlap * 2 + rating + SLA_weight`

Where:

- `services_overlap`: Number of matching services
- `rating`: Vendor rating (0-5)
- `SLA_weight`: `48 / response_sla_hours` (higher SLA = better score)

## 📋 API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Clients

- `GET /clients` - List clients (Admin only)
- `POST /clients` - Create client (Admin only)
- `GET /clients/:id` - Get client details
- `PATCH /clients/:id` - Update client (Admin only)
- `DELETE /clients/:id` - Delete client (Admin only)

### Projects

- `GET /projects` - List projects (user-specific)
- `POST /projects` - Create project
- `GET /projects/:id` - Get project details
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project (Admin only)
- `POST /projects/:id/matches/rebuild` - Rebuild matches
- `GET /projects/:id/matches` - Get project matches

### Vendors

- `GET /vendors` - List vendors
- `POST /vendors` - Create vendor (Admin only)
- `GET /vendors/:id` - Get vendor details
- `PATCH /vendors/:id` - Update vendor (Admin only)
- `DELETE /vendors/:id` - Delete vendor (Admin only)

### Research

- `GET /research` - List research documents
- `POST /research` - Create research document
- `GET /research/search` - Search documents
- `GET /research/:id` - Get research document
- `PATCH /research/:id` - Update research document
- `DELETE /research/:id` - Delete research document

### Analytics

- `GET /analytics/top-vendors` - Top vendors by country with research counts

### Correct Workflow steps

- Create Admin User

- Create Client Company → Get company ID

- Create Company User for that company

- Create Vendors with services and countries

- Create Projects for the client company

- Generate Matches for projects

- Add Research Documents to projects

- View Analytics across both databases

# 👥 Default Admin User

- **Admin:** `admin@user.com` / `adminpassword`

---

# 🚀 Deployment

The application can be deployed to:

- **Render** (recommended for free tier)
- **Railway**
- **AWS Elastic Beanstalk**
- **Heroku**

---

# 📝 Important Notes

- Company Users must be registered after their **Client Company** exists.
- Projects belong to **Client Companies**, not individual users.
- Vendors are created by **Admins only**.
- Matching requires compatible **countries** and **services**.

## 🐳 Docker Deployment

```bash
# Start with Docker Compose
docker-compose up -d

# Build and start
docker-compose up --build

# Stop services
docker-compose down
```
