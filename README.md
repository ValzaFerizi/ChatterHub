# Formify — Forms + Sheets

Aplikacion full-stack per krijim formash, mbledhje pergjigjesh dhe bashkepunim ne kohe reale.

## Stack Teknologjik

| Layer | Teknologjia |
|-------|-------------|
| Backend | Node.js + Express.js |
| Frontend | React + Vite |
| SQL Database | MySQL + Sequelize |
| NoSQL Database | MongoDB + Mongoose |
| Real-Time | Socket.io |
| Auth | JWT + bcryptjs |
| Cache / Queue | Redis + Bull |
| DevOps | Docker + docker-compose |
| State Management | Zustand |

## Features

- ✅ Authentication (JWT, Refresh Tokens, Logout)
- ✅ Role-Based Access Control (Admin / User)
- ✅ Form Builder me 9 tipe pyetjesh (Short answer, Paragraph, Multiple choice, Checkbox, Dropdown, Date, Time, File Upload, Photo Upload)
- ✅ Real-Time Collaboration (Socket.io)
- ✅ Notification Bell me njoftime live
- ✅ Advanced Search me filtra (All, Forms, Users, Questions, Responses)
- ✅ Export / Import (CSV, Excel, JSON)
- ✅ Dynamic Reports per cdo forme
- ✅ Audit Logs per te gjitha veprimet
- ✅ Dashboard me statistika dhe grafike
- ✅ Sheets me te dhena reale nga pergjigjet
- ✅ CMS Settings (Application Name, Tagline, Colors)

## Kerkesa paraprake

- Node.js v18+
- MySQL 8+
- MongoDB
- Redis
- npm

## Instalimi

### 1. Klono projektin
\`\`\`bash
git clone https://github.com/ValzaFerizi/ChatterHub.git
cd ChatterHub
\`\`\`

### 2. Instalo paketat
\`\`\`bash
cd backend && npm install
cd ../frontend && npm install
\`\`\`

### 3. Krijo .env
\`\`\`bash
cd backend
cp .env.example .env
\`\`\`

Ndryshoji keto variabla ne `.env`:

\`\`\`env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=chatterhub
DB_USER=root
DB_PASSWORD=
MONGO_URI=mongodb://localhost:27017/chatterhub
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
REDIS_URL=redis://localhost:6379
ALLOWED_ORIGIN=http://localhost:5173
\`\`\`

### 4. Krijo databazën MySQL
\`\`\`bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS chatterhub;"
\`\`\`

### 5. Nis sherbimet
\`\`\`bash
brew services start mongodb-community
brew services start redis
brew services start mysql
\`\`\`

### 6. Nis Backend
\`\`\`bash
cd backend && npm run dev
\`\`\`

### 7. Nis Frontend
\`\`\`bash
cd frontend && npm run dev
\`\`\`

Aplikacioni eshte ne: `http://localhost:5173`

## Me Docker
\`\`\`bash
docker-compose up --build
\`\`\`

## API Endpoints

### Auth
| Method | Endpoint | Pershkrimi |
|--------|----------|------------|
| POST | /api/auth/register | Regjistro user te ri |
| POST | /api/auth/login | Kycu |
| POST | /api/auth/logout | Dil |
| POST | /api/auth/refresh | Rifresko token |
| GET | /api/auth/me | Profili i userit |
| GET | /api/auth/users | Lista e users (admin) |

### Forms
| Method | Endpoint | Pershkrimi |
|--------|----------|------------|
| GET | /api/forms | Te gjitha format |
| POST | /api/forms | Krijo forme te re |
| GET | /api/forms/:id | Merr forme |
| PUT | /api/forms/:id | Perditeso forme |
| DELETE | /api/forms/:id | Fshi forme |

### Questions
| Method | Endpoint | Pershkrimi |
|--------|----------|------------|
| POST | /api/questions/forms/:formId/questions | Shto pyetje |
| GET | /api/questions/forms/:formId/questions | Merr pyetjet |
| PUT | /api/questions/:questionId | Perditeso pyetje |
| DELETE | /api/questions/:questionId | Fshi pyetje |

### Search
| Method | Endpoint | Pershkrimi |
|--------|----------|------------|
| GET | /api/search?q=... | Kerko ne Forms, Users, Questions, Responses |

### Export / Import
| Method | Endpoint | Pershkrimi |
|--------|----------|------------|
| POST | /api/export/csv | Eksporto si CSV |
| POST | /api/export/excel | Eksporto si Excel |
| POST | /api/export/json | Eksporto si JSON |
| POST | /api/export/import/csv | Importo nga CSV |
| POST | /api/export/import/excel | Importo nga Excel |
| POST | /api/export/import/json | Importo nga JSON |

### Reports
| Method | Endpoint | Pershkrimi |
|--------|----------|------------|
| POST | /api/reports/csv | Gjenero raport CSV |
| POST | /api/reports/excel | Gjenero raport Excel |

### Audit Logs
| Method | Endpoint | Pershkrimi |
|--------|----------|------------|
| GET | /api/audit | Te gjitha audit logs (admin) |

## Siguria

- JWT access token (15 min) + refresh token (7 dite)
- Password hashing me bcryptjs
- Token blacklisting ne MongoDB
- Rate limiting: max 10 kerkesa / 15 minuta
- CORS i konfiguruar
- Input validation me express-validator
- RBAC: role-based access control

## Kontributet

| Member | GitHub | Commits | Detyrat |
|--------|--------|---------|---------|
| Alda Muhadri | aldamuhadri | 38 | JWT Authentication backend dhe frontend, RBAC me roles/permissions/middleware, Security (helmet, CORS, rate limiting, validation), MySQL/MongoDB models, Users menaxhim (deactivate, role change), Audit Logs faqe me emrat e users, Advanced Search role-based me sidebar filtra, Dashboard me statistika reale nga API, Lazy Loading me React.lazy()+Suspense, Import/Export dropdown UI, Forms lidhje me API |
| Valza Ferizi | ValzaFerizi | 23 | ERD Diagram, Forms/Sections/Questions/Responses/ResponseAnswers CRUD API, FormCollaborators, Tags, FormTags modelet, repositories dhe services per te gjitha entitetet |
| Blendina Muhadri | blendinamuhadri | 43 | Socket.io backend dhe frontend (presence, cursors, notifications), Notification Bell me live badge, Sheets me te dhena reale nga MySQL, FormDetail me plotesim pergjigjesh dhe response counter, Dashboard me statistika role-based, response count per forme, CMS Settings (Application Name, Tagline, Welcome Message, Primary Color) |
| Elita Rrahmani | ElitaRrahmani | 4 |Implementim i strukturës bazë të Frontend UI, Dashboard-it me charts interaktive duke përdor Recharts, menaxhim i state-it me Zustand, dizajnim dhe integrim i Navbar UI, rregullime në Audit Logs dhe Token Service, si dhe testim i API endpoints përmes Swagger.
| Adea Hoti | AdeaHoti | 27 | Docker + docker-compose, Export CSV/Excel/JSON backend service, Import CSV/Excel/JSON backend service, Export UI me dropdown per Forms/Sheets/Users/Responses/AuditLogs, Loading states dhe progress bar per export, Dynamic Reports me Bull Queue dhe Redis, AuthProvider/Navbar/Sidebar fixes, File Upload dhe Photo Upload te CreateForm |

## Lenda

**Lenda Laboratorike 2 — Viti Akademik 2025/2026 — UBT**
