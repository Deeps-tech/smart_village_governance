# Deployment Guide - GramSwaraj Smart Village Governance Platform

This document describes the steps required to configure, build, run, and test the GramSwaraj Smart Village Governance Platform.

---

## 🛠️ Prerequisites
Before starting, ensure the following are installed:
1. **JDK 17** (or 21)
2. **Maven 3.8+**
3. **Node.js 18+ & npm 9+**
4. **Docker & Docker Compose** (Optional, for containerized deployment)
5. **MongoDB** (A local instance or a MongoDB Atlas Cloud account)

---

## 🍃 MongoDB Atlas Configuration
GramSwaraj uses MongoDB to store all documents. Follow these steps to configure a Cloud Cluster:

1. **Sign Up**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and register for a free account.
2. **Create Cluster**: Select the **M0 Shared Free Tier** cluster and choose your preferred cloud provider (e.g., AWS) and region.
3. **Configure Access**:
   - **Database Access**: Create a database user (e.g. `Hospital`) and assign a secure password.
   - **Network Access**: Add a new IP address rule. For development/testing, you can add `0.0.0.0/0` (allow access from anywhere) or whitelist your local machine's IP.
4. **Obtain Connection String**:
   - Click on the **Connect** button on your database cluster console.
   - Choose **Connect your application** (Drivers).
   - Copy the connection URI:
     ```text
     mongodb+srv://Hospital:<db_password>@cluster0.yvjalux.mongodb.net/smart_village_db?retryWrites=true&w=majority
     ```
   - Replace `<db_password>` with the password of the database user created in step 3.

---

## ⚙️ Environment Variables
The application consumes the connection URI through environment variables.

| Variable Name | Description | Default Value |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB connection connection string | `mongodb://localhost:27017/smart_village_db` |

---

## 📦 Running Locally

### 1. Spring Boot Backend
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Set the `MONGODB_URI` environment variable:
   - **Windows PowerShell**:
     ```powershell
     $env:MONGODB_URI="mongodb+srv://Hospital:<db_password>@cluster0.yvjalux.mongodb.net/smart_village_db?retryWrites=true&w=majority"
     ```
   - **Windows Command Prompt (CMD)**:
     ```cmd
     set MONGODB_URI=mongodb+srv://Hospital:<db_password>@cluster0.yvjalux.mongodb.net/smart_village_db?retryWrites=true&w=majority
     ```
   - **Linux / macOS Bash**:
     ```bash
     export MONGODB_URI="mongodb+srv://Hospital:<db_password>@cluster0.yvjalux.mongodb.net/smart_village_db?retryWrites=true&w=majority"
     ```
3. Build and run the backend application:
   ```bash
   mvn spring-boot:run
   ```
   The backend API will start and bind to `http://localhost:8080`.
   *(Note: The embedded data seeder runs on startup and initializes the collections if empty.)*

### 2. React Vite Frontend
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend application will boot and launch at `http://localhost:5173`.

---

## 🐳 Running with Docker Compose
To deploy the entire stack (React app, Spring Boot API, and local MongoDB database) in a unified docker bridge network:

1. Navigate to the root directory containing `docker-compose.yml`:
   ```bash
   cd ..
   ```
2. Run docker compose up with the build flag:
   ```bash
   docker-compose up --build
   ```
3. Containers created:
   - **gramswaraj_db**: Local MongoDB instance listening on port `27017`.
   - **gramswaraj_backend**: Spring Boot application running on port `8080`.
   - **gramswaraj_frontend**: React frontend static application served by Nginx on port `80` (accessible via `http://localhost`).

*To run in detached daemon mode, execute `docker-compose up -d --build`.*

---

## 📡 API Testing & Verification

### 1. Swagger UI OpenAPI Documentation
Once the backend starts, you can browse and test all endpoints interactively:
- **URL**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **Authentication**:
  1. Go to the `POST /api/auth/login` endpoint.
  2. Log in using `admin` / `password123`.
  3. Copy the returned `token` (JWT).
  4. Click the **Authorize** lock button at the top right of Swagger UI, paste the JWT into the field, and click **Authorize**. You can now invoke protected endpoints directly.

### 2. Postman Collection
- Import [GramSwaraj.postman_collection.json](./GramSwaraj.postman_collection.json) directly into Postman.
- Set up global collection variables:
  - `base_url` -> `http://localhost:8080/api`
- Run requests sequentially. The login request is pre-configured with a test script to automatically extract and populate the `{{jwt_token}}` variable.

---

## 🔑 Seed User Accounts
The automatic data seeder configures three roles out of the box:

* **Super Admin**:
  * Username: `admin`
  * Password: `password123`
* **Village Officer**:
  * Username: `officer`
  * Password: `password123`
* **Citizen**:
  * Username: `citizen`
  * Password: `password123`
