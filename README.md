# Digital Kohat - Comprehensive Smart City Platform

Digital Kohat is a robust, full-stack (MERN) platform designed to centralize and modernize city services in Kohat. It serves as a digital bridge between citizens, service providers, and city administration, offering a wide range of integrated features and real-time monitoring capabilities.

## 🌟 Services Offered

Digital Kohat is organized into several key sectors, each providing specialized services to the community:

- **🎓 Education Sector**:
  - Digital directories for Schools and Colleges.
  - Transparent Online Admission process with payment verification.
  - Access to Online Courses and professional Online Trainings.
  - Platform for finding qualified private Tutors.
- **🏥 Healthcare Sector**:
  - Information and directory of local Hospitals and private clinics.
  - Doctor profiles and appointment registration/request system.
- **🍔 Food & Hospitality**:
  - Showcase for local Restaurants and food outlets.
  - Integrated registration for new food-related businesses.
- **💼 Business & Finance**:
  - Local business directory for better economic visibility.
  - Support for registering new business services into the smart city network.
- **🛠️ Technical Services**:
  - Directory of verified Technicians (Electricians, Plumbers, etc.) for home and office needs.
- **🗺️ Tourism & Heritage**:
  - Promotion of local tourism spots and historical sites in Kohat.

## 🚀 Key Technical Features

### 1. Real-Time Notification System (Socket.IO)
- **Instant Alerts**: Superadmins receive immediate visual and audio notifications when new service requests or admissions are submitted.
- **Context-Aware Badges**: Dynamic red notification circles appear on the sidebar and sub-navigation tabs, showing live counts of pending tasks.
- **Sync Logic**: The system automatically fetches initial counts from the database upon login and clears/resets them once a module is visited.

### 2. Advanced Multi-Level Dashboard
- **Superadmin Control**: Centralized management of all city sectors and sector managers.
- **Sector Managers**: Specialized dashboards for managing specific areas like Education or Health.
- **Institute/Admin Verification**: Two-step verification process to ensure service provider authenticity.

### 3. Cloud-Based Asset Management (Cloudinary)
- **Optimized Storage**: All images, including payment screenshots and institution profiles, are stored on Cloudinary.
- **Secure Uploads**: Uses `multer` and `streamifier` for safe, buffer-based streaming from the server to the cloud.

### 4. Comprehensive Form-Based Workflows
- Integrated forms for student admissions, new service registration, and doctor registration, featuring automated data handling and validation.

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React, React-Router-Dom, Socket.io-client, React-Icons, React-Toastify |
| **Backend** | Node.js, Express, Socket.io, JWT (Authentication), Argon2 (Password Hashing) |
| **Database** | MongoDB (Mongoose ODM) |
| **Utilities** | Cloudinary, Multer, Axios, Leaflet (Maps) |

## 🏗️ Project Architecture

```text
Digital-Kohat/
├── Backend/
│   ├── Controller/      # Core business logic (SuperAdmin, Education, etc.)
│   ├── HelperFun/      # Utility functions (Collection selection, etc.)
│   ├── Models/          # Mongoose Schemas (Users, Admissions, Requests)
│   ├── Router/          # API route definitions
│   └── index.js         # Entry point & Socket.io setup
├── Frontend/
│   ├── src/
│   │   ├── ApiCalls/    # Centralized axios requests
│   │   ├── components/  # Reusable UI components (Forms, Navbar)
│   │   └── Pages/       # Sector-specific pages (Education, Health, etc.)
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16.x or higher)
- MongoDB (Running instance)
- Cloudinary credentials (API Key, Secret, Cloud Name)

### Installation

1. **Backend**:
   ```bash
   cd Backend
   npm install
   # Configure .env with DB and Cloudinary keys
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd Frontend
   npm install
   npm start
   ```

---
*Digital Kohat - Empowerment through Digitalization.*
# Digital-kohat
