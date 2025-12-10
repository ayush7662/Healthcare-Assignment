# Patient Document Portal — Design Document

## 📌 1️⃣ Tech Stack Choices

### Q1. What frontend framework did you use and why?

**React + Vite**

- Fast development experience with HMR
- Component-based UI
- Better performance & bundle speed compared to CRA
- Strong ecosystem + Tailwind integration

### Q2. What backend framework did you choose and why?

**Node.js + Express.js**

- Lightweight & popular for REST API development
- Easy file upload handling with Multer
- Fast performance using non-blocking I/O

### Q3. What database did you choose and why?

**SQLite**

- Lightweight + requires no installation
- Perfect for local development assignments
- File-based storage, easy backups
- Sufficient for a single-user local app

### Q4. If supporting 1,000 users, what changes would be needed?

- Replace SQLite with **PostgreSQL** for concurrency
- Serve file storage using **AWS S3** / **Google Cloud Storage**
- Add **authentication** (JWT or OAuth)
- Implement email/password or OTP login
- Improve API security (rate limiting, access rules)
- Use **NGINX** or load balancer for scalability

## 2. Architecture Overview
┌────────────────┐          Upload / Fetch           ┌────────────────┐
│    Frontend     │ ───────────────────────────────▶ │    Backend     │
│  React + Vite   │         JSON / File APIs          │  Express.js    │
└───────┬────────┘                                   └───────┬────────┘
│                                                    │
│ Preview / Download                                 │ Query / Save
▼                                                    ▼
┌────────────────┐                                  ┌────────────────┐
│  Local Uploads  │ ◀──────────────────────────────▶ │   SQLite DB    │
│    Folder       │        File operations           │ documents table│
└────────────────┘                                  └────────────────┘
text## 3. API Specification

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/documents/upload` | POST | Upload a PDF file |
| `/documents` | GET | List all uploaded documents |
| `/documents/:id` | GET | Download specific file |
| `/documents/:id` | DELETE | Delete specific file |

### 📍 API Details

#### POST /documents/upload

Upload a PDF file

**Request (multipart/form-data):**

```
file: <PDF File>
```

**Response (200):**

```json
{
  "message": "File uploaded successfully",
  "document": {
    "id": 5,
    "filename": "12345-report.pdf",
    "originalName": "report.pdf",
    "size": 29045
  }
}
```

#### GET /documents

Returns all documents

**Response:**

```json
[
  {
    "id": 1,
    "originalName": "blood_report.pdf",
    "filesize": 204800,
    "created_at": "2025-12-09 15:43:21"
  }
]
```

#### GET /documents/:id

Downloads a PDF file

**Response:**

```
⬇ PDF file download to browser
```

#### DELETE /documents/:id

Deletes file + database record

**Response:**

```json
{
  "message": "Document deleted successfully"
}
```

## 🔄 4️⃣ Data Flow Description

### 📝 Upload Flow

1. User selects a file in UI
2. React sends `multipart/form-data` → `/documents/upload`
3. Backend validates: must be PDF
4. Multer saves file into `uploads/` folder
5. SQLite stores metadata (name, path, size, created_at)
6. API response triggers UI refresh (without reload)
7. File appears instantly in the list

### 📤 Download Flow

User clicks "Download" on a document
Frontend calls GET /documents/:id
Backend retrieves the file path from the database
File is streamed to the browser with Content-Disposition: attachment

5. Assumptions & Constraints

Only one user → no authentication or login system needed
Only PDF files are allowed
Files are stored locally in an uploads/ folder
Files are expected to be reasonably small (no chunked uploads)
Application runs locally (not deployed to the cloud)
No concurrency concerns due to single-user design