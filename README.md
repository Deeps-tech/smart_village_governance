# Smart Village Governance Platform (GramSwaraj)

A centralized, secure, and production-ready digital governance platform designed for the **Smart India Hackathon**. GramSwaraj digitizes village administration, streamlines citizen service requests, automates grievance redressal with escalations, logs infrastructure status, and monitors budget utilization with visual analytics.

---

## 📂 Folder Structure

```text
myproject/
├── backend/
│   ├── pom.xml                               # Maven project configuration
│   └── src/
│       └── main/
│           ├── java/com/smartvillage/governance/
│           │   ├── GovernanceApplication.java# Boot Entrypoint
│           │   ├── config/
│           │   │   ├── CorsConfig.java       # Global CORS Setup
│           │   │   └── SecurityConfig.java   # Spring Security 6 & RBAC Config
│           │   ├── controllers/              # REST Controller Layer
│           │   │   ├── AnnouncementController.java
│           │   │   ├── AuthController.java
│           │   │   ├── BudgetController.java
│           │   │   ├── CitizenController.java
│           │   │   ├── DashboardController.java
│           │   │   ├── GrievanceController.java
│           │   │   ├── InfrastructureController.java
│           │   │   └── SchemeController.java
│           │   ├── dto/                      # Validation Request/Response DTOs
│           │   │   ├── AnnouncementDTO.java
│           │   │   ├── BudgetDTO.java
│           │   │   ├── CitizenDTO.java
│           │   │   ├── DashboardMetricsResponse.java
│           │   │   ├── GrievanceAssignRequest.java
│           │   │   ├── GrievanceDTO.java
│           │   │   ├── GrievanceStatusRequest.java
│           │   │   ├── JwtResponse.java
│           │   │   ├── LoginRequest.java
│           │   │   ├── RefreshTokenRequest.java
│           │   │   ├── SchemeApplyRequest.java
│           │   │   ├── SchemeApprovalRequest.java
│           │   │   ├── SchemeDTO.java
│           │   │   └── TransactionDTO.java
│           │   ├── models/                   # Document Entities Layer
│           │   │   ├── Announcement.java
│           │   │   ├── Budget.java
│           │   │   ├── Citizen.java
│           │   │   ├── Grievance.java
│           │   │   ├── Role.java             # Role Enum
│           │   │   ├── Scheme.java
│           │   │   └── User.java
│           │   ├── repositories/             # Spring Data Mongo Repositories
│           │   │   ├── AnnouncementRepository.java
│           │   │   ├── BudgetRepository.java
│           │   │   ├── CitizenRepository.java
│           │   │   ├── GrievanceRepository.java
│           │   │   ├── SchemeRepository.java
│           │   │   └── UserRepository.java
│           │   ├── security/                 # JWT Authentication Filter & Token Utilities
│           │   │   ├── CustomUserDetails.java
│           │   │   ├── CustomUserDetailsService.java
│           │   │   ├── JwtAuthenticationFilter.java
│           │   │   └── JwtTokenProvider.java
│           │   └── services/                 # Service Business Logic Layer
│           │       ├── AnnouncementService.java
│           │       ├── AuthService.java
│           │       ├── BudgetService.java
│           │       ├── CitizenService.java
│           │       ├── DashboardService.java
│           │       ├── GrievanceService.java
│           │       ├── InfrastructureService.java
│           │       └── SchemeService.java
│           └── resources/
│               └── application.properties    # Database configuration & App variables
│
├── frontend/
│   ├── index.html                            # HTML Template with SEO metadata
│   ├── tailwind.config.js                    # Design System configuration
│   ├── postcss.config.js
│   ├── tsconfig.json                         # TypeScript compiler setup
│   ├── package.json                          # NPM dependencies list
│   └── src/
│       ├── main.tsx                          # React boot mount script
│       ├── App.tsx                           # Routing & Guard mappings
│       ├── index.css                         # Tailwind stylesheet & custom utilities
│       ├── components/                       # Shared custom UI widgets
│       │   ├── Layout.tsx                    # Shell template & responsive navigation
│       │   └── ProtectedRoute.tsx            # Route auth RBAC guard
│       ├── context/
│       │   └── AuthContext.tsx               # Session state provider
│       ├── services/
│       │   └── api.ts                        # Axios API interceptor configurations
│       └── pages/                            # Frontend View Pages
│           ├── Announcements.tsx             # Notice Bulletin Board
│           ├── Budget.tsx                    # Transactions & fund graphs
│           ├── Citizens.tsx                  # Citizen registry directory
│           ├── Dashboard.tsx                 # Analytical KPI graphics
│           ├── Grievances.tsx                # Redressal portal & log actions
│           ├── Login.tsx                     # Authentication entry portals
│           ├── Register.tsx                  # Account creation
│           ├── Schemes.tsx                   # Welfare application pipelines
│           └── Settings.tsx                  # Official management & profiles
```

---

## 🌐 MongoDB Atlas Configuration

The application uses **Spring Data MongoDB** to interact with MongoDB Atlas.

### 1. Spring Boot Properties Setup
Ensure your connection properties in `backend/src/main/resources/application.properties` align with:
```properties
spring.data.mongodb.uri=${MONGODB_URI}
spring.data.mongodb.database=smart_village_db
```

### 2. Indexes Configured in Java Classes
- **User Document**: `@Indexed(unique = true)` on `username` to prevent login duplications.
- **Citizen Document**: `@Indexed(unique = true)` on `aadhaarRef` to block double registrations. `@Indexed` on `name` to speed up search-by-name lookups.
- **Grievance Document**: `@Indexed` on `citizenId`, `assignedOfficerId`, `status`, and `category` to enable fast dashboard filtering.
- **Scheme Document**: `@Indexed(unique = true)` on `name` to guarantee unique welfare scheme records.

---

## 📡 REST API Documentation

All request bodies are passed as JSON and secured using a `Bearer <JWT_TOKEN>` header.

### 🔑 Authentication Module
- `POST /api/auth/register`: Signup a new user.
  - **Body**: `{ "username": "...", "password": "...", "email": "...", "role": "CITIZEN|VILLAGE_OFFICER|SUPER_ADMIN", "villageId": "..." }`
- `POST /api/auth/login`: Authenticate and obtain JWT.
  - **Body**: `{ "username": "...", "password": "..." }`
  - **Response**: Returns access token, refresh token, role, and username.
- `POST /api/auth/refresh`: Obtain new access token via refresh token.
  - **Body**: `{ "refreshToken": "..." }`

### 👥 Citizen Directory
- `GET /api/citizens`: Get all citizens (allows filter `?name=...`). *Requires SUPER_ADMIN or VILLAGE_OFFICER*.
- `POST /api/citizens`: Register a new citizen. *Requires SUPER_ADMIN*.
  - **Body**: `{ "name": "...", "email": "...", "phone": "...", "aadhaarRef": "...", "occupation": "...", "gender": "MALE|FEMALE", "dateOfBirth": "YYYY-MM-DD", "address": "..." }`
- `PUT /api/citizens/{id}`: Modify details. *Requires SUPER_ADMIN*.
- `DELETE /api/citizens/{id}`: Remove record. *Requires SUPER_ADMIN*.

### ⚠️ Grievance Portal
- `POST /api/grievances`: Citizen registers a complaint. *Requires CITIZEN*.
  - **Body**: `{ "title": "...", "description": "...", "category": "Water|Road|...", "imageUrl": "..." }`
- `GET /api/grievances`: Fetch grievances. Citizens see only their own. Officers/Admins see all.
- `PUT /api/grievances/{id}/assign`: Assign to an officer. *Requires OFFICER or ADMIN*.
  - **Body**: `{ "assignedOfficerId": "..." }`
- `PUT /api/grievances/{id}/status`: Progress status workflow. *Requires OFFICER or ADMIN*.
  - **Body**: `{ "status": "IN_PROGRESS|RESOLVED|CLOSED", "resolutionNotes": "..." }`

### 🏵️ Welfare Schemes
- `POST /api/schemes`: Launch a new welfare scheme. *Requires OFFICER or ADMIN*.
  - **Body**: `{ "name": "...", "description": "...", "eligibilityCriteria": "...", "allocatedBudget": 50000, "launchDate": "YYYY-MM-DD" }`
- `GET /api/schemes`: Fetch all schemes.
- `POST /api/schemes/{id}/apply`: Apply for a scheme. *Requires CITIZEN*.
  - **Body**: `{ "citizenName": "...", "remarks": "..." }`
- `PUT /api/schemes/{id}/applicants/{userId}/status`: Process approval. *Requires OFFICER or ADMIN*.
  - **Body**: `{ "status": "APPROVED|REJECTED", "remarks": "..." }`

### 🏗️ Infrastructure & Assets
- `POST /api/infrastructure`: Log a new public asset. *Requires OFFICER or ADMIN*.
  - **Body**: `{ "assetName": "...", "assetType": "ROADS|STREET_LIGHTS|...", "location": "...", "status": "OPERATIONAL", "maintenanceCost": 12000 }`
- `PUT /api/infrastructure/{id}/status`: Log an inspection report. *Requires OFFICER or ADMIN*.
  - **Body**: `{ "status": "UNDER_MAINTENANCE|NEEDS_REPAIR|OPERATIONAL", "maintenanceCost": 15000 }`

### 💰 Budget & Analytics
- `POST /api/budgets`: Allocate department funds. *Requires SUPER_ADMIN*.
  - **Body**: `{ "financialYear": "2026-2027", "allocatedAmount": 1000000, "department": "INFRASTRUCTURE" }`
- `POST /api/budgets/{id}/transactions`: Log debit/credit expenditure. *Requires SUPER_ADMIN*.
  - **Body**: `{ "amount": 25000, "description": "...", "category": "DEBIT|CREDIT" }`
- `GET /api/budgets/report`: Summarized budget reports. *Requires OFFICER or ADMIN*.

---

## 📬 Postman Collection Mock JSON

Import this JSON text directly into Postman to load pre-configured REST API requests:

```json
{
  "info": {
    "name": "GramSwaraj - Smart Village API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"sarpanch\",\n  \"password\": \"password123\",\n  \"email\": \"sarpanch@village.gov.in\",\n  \"role\": \"SUPER_ADMIN\",\n  \"villageId\": \"VILL-001\"\n}",
              "options": { "raw": { "language": "json" } }
            },
            "url": { "raw": "http://localhost:8080/api/auth/register", "protocol": "http", "host": ["localhost"], "port": "8080", "path": ["api", "auth", "register"] }
          }
        },
        {
          "name": "Login User",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"sarpanch\",\n  \"password\": \"password123\"\n}",
              "options": { "raw": { "language": "json" } }
            },
            "url": { "raw": "http://localhost:8080/api/auth/login", "protocol": "http", "host": ["localhost"], "port": "8080", "path": ["api", "auth", "login"] }
          }
        }
      ]
    },
    {
      "name": "Citizens",
      "item": [
        {
          "name": "Create Citizen Record",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{jwt_token}}", "type": "text" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Aarav Patel\",\n  \"email\": \"aarav.p@gmail.com\",\n  \"phone\": \"9876543210\",\n  \"aadhaarRef\": \"XXXX-XXXX-9988\",\n  \"occupation\": \"Agriculture\",\n  \"gender\": \"MALE\",\n  \"dateOfBirth\": \"1992-04-15\",\n  \"address\": \"Panchayat Ward 1, Pipili, Odisha\"\n}",
              "options": { "raw": { "language": "json" } }
            },
            "url": { "raw": "http://localhost:8080/api/citizens", "protocol": "http", "host": ["localhost"], "port": "8080", "path": ["api", "citizens"] }
          }
        }
      ]
    }
  ]
}
```

---

## 🚀 Deployment Instructions

### Prerequisite Environment Configurations
1. **JDK 17** must be active.
2. **MongoDB Atlas Cluster**: Copy your Cluster MONGODB_URI.

### 1. Spring Boot Backend Build & Run
From the `backend` directory, run:
```powershell
# Set database cluster connection (Windows PowerShell)
$env:MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.r0mchrz.mongodb.net/smart_village_db?retryWrites=true&w=majority"

# Run Spring Boot Application
mvn spring-boot:run
```
The server will start on port `8080`.

### 2. React Vite Frontend Build & Run
From the `frontend` directory, run:
```bash
# Install NPM packages
npm install

# Start Local Dev Server
npm run dev
```
The client app will launch locally (typically at `http://localhost:5173`).

---

## 🏆 Smart India Hackathon Presentation Points

### 1. Problem Statement Focus
- Village administration currently relies on manual paper ledgers, creating service bottlenecks.
- Disconnected records make welfare scheme tracking and grievance handling opaque.

### 2. GramSwaraj - The Solution
- **Centralized Admin Control**: Digitized citizen directory census index.
- **Automated Grievance Life-Cycle**: Citizens file issues with photo proof; authorities review, assign officers, record resolutions, and archive logs.
- **Analytical transparency**: Financial transparency with visual bar charts plotting allocations vs debit transactions.
- **Role-Based Workspaces**: Custom user interfaces dynamically adjusting layout options for Citizens, Officers, and Admins.

### 3. Key USPs for Judges
- **MongoDB Atlas Scale**: Dynamic scheme structures with nested subdocuments representing applications under a single document schema.
- **Robust Security**: BCrypt password encryption combined with JWT access-refresh tokens guarding APIs.
- **Wow Factor Design**: Premium dark-mode glassmorphic layouts styled with Tailwind CSS, Recharts analytics, and Lucide vector icons.
