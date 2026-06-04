# ChatterHub

Aplikacion full-stack per krijim formash dhe bashkepunim ne kohe reale.

## Stack
- Backend: Node.js + Express.js
- Frontend: React + Vite
- SQL: MySQL + Sequelize
- NoSQL: MongoDB + Mongoose
- Auth: JWT + bcryptjs
- Cache: Redis (token blacklisting)

## Instalimi

1. Klono projektin
git clone https://github.com/ValzaFerizi/ChatterHub.git
cd ChatterHub
git checkout feature/auth-backend

2. Instalo paketat
npm install
cd frontend && npm install && cd ..

3. Krijo .env
cp .env.example .env

4. Krijo databazën MySQL
mysql -u root -e "CREATE DATABASE IF NOT EXISTS chatterhub;"

5. Nis MongoDB
brew services start mongodb-community

6. Nis serverin
npm run dev

7. Nis frontend
cd frontend && npm run dev

## API Endpoints

### Auth
POST   /api/auth/register  - Regjistro user te ri
POST   /api/auth/login     - Kycu dhe merr tokens
POST   /api/auth/logout    - Dil dhe revoko token
POST   /api/auth/refresh   - Rifresko access token
GET    /api/auth/me        - Merr profilin e userit

### Roles (vetem admin)
GET    /api/roles               - Lista e roleve
POST   /api/roles/assign        - Cakto rol userit
GET    /api/roles/user/:userId  - Rolet e userit

### Permissions (vetem admin)
GET    /api/permissions                  - Lista e permissions
POST   /api/permissions/assign           - Cakto permission rolit
GET    /api/permissions/role/:roleId     - Permissions e rolit

### Audit Logs (vetem admin)
GET    /api/audit                - Te gjitha audit logs
GET    /api/audit/user/:userId   - Logs per user

## Siguria
- JWT access token (15 min) + refresh token (7 dite)
- Password hashing me bcryptjs
- Token blacklisting ne MongoDB
- Session caching ne MongoDB
- Rate limiting: max 10 kerkesa / 15 minuta
- CORS i konfiguruar me whitelist
- Input validation me express-validator
- RBAC: role-based access control
