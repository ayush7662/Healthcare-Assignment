# Patient Document Portal — Design Document

## 📌 1. Tech Stack Choices

### Q1. What frontend framework did you use and why?

**React + Vite**

- Fast development experience with Hot Module Replacement (HMR)
- Component-based UI architecture
- Better performance and bundle speed compared to Create React App (CRA)
- Strong ecosystem with excellent Tailwind CSS integration

### Q2. What backend framework did you choose and why?

**Node.js + Express.js**

- Lightweight and widely adopted for REST API development
- Simple file upload handling with Multer middleware
- High performance using non-blocking I/O operations
- Extensive middleware ecosystem for common tasks

### Q3. What database did you choose and why?

**SQLite**

- Lightweight with zero configuration required
- Ideal for local development and prototype applications
- File-based storage enables easy backups and portability
- Sufficient for single-user local applications

### Q4. If supporting 1,000 users, what changes would be needed?

- **Database**: Replace SQLite with **PostgreSQL** or **MySQL** for better concurrency handling and ACID compliance
- **File Storage**: Migrate to cloud object storage (**AWS S3** or **Google Cloud Storage**) for scalability and CDN integration
- **Authentication**: Implement **JWT-based authentication** or **OAuth 2.0** with email/password or OTP login
- **Security**: Add rate limiting, input validation, CSRF protection, and role-based access control (RBAC)
- **Infrastructure**: Deploy with **NGINX** reverse proxy and horizontal scaling via load balancers
- **Monitoring**: Add logging, analytics, and health check endpoints

---

## 2. Architecture Overview

```
┌────────────────┐          Upload / Fetch           ┌────────────────┐
│    Frontend    │ ───────────────────────────────▶ │    Backend     │
│  React + Vite  │         JSON / File APIs          │  Express.js    │
└───────┬────────┘                                   └───────┬────────┘
        │                                                    │
        │ Preview / Download                                 │ Query / Save
        ▼                                                    ▼
┌────────────────┐                                  ┌────────────────┐
│  Local Uploads │ ◀──────────────────────────────▶ │   SQLite DB    │
│    Folder      │        File operations           │ documents table│
└────────────────┘                                  └────────────────┘
```

---

## 3. API Specification

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/documents/upload` | POST | Upload a PDF file |
| `/documents` | GET | List all uploaded documents |
| `/documents/:id` | GET | Download specific file |
| `/documents/:id` | DELETE | Delete specific file |

### 📍 API Details

#### POST /documents/upload

Upload a PDF file.

**Request (multipart/form-data):**

```
file: <PDF File>
```

**Response (200 OK):**

```json
{
  "message": "File uploaded successfully",
  "document": {
    "id": 5,
    "filename": "12345-report.pdf",
    "originalName": "report.pdf",
    "size": 29045,
    "created_at": "2025-12-09T15:43:21Z"
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "error": "Only PDF files are allowed"
}
```

---

#### GET /documents

Returns all uploaded documents.

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "originalName": "blood_report.pdf",
    "filesize": 204800,
    "created_at": "2025-12-09T15:43:21Z"
  },
  {
    "id": 2,
    "originalName": "prescription.pdf",
    "filesize": 156000,
    "created_at": "2025-12-09T16:20:45Z"
  }
]
```

---

#### GET /documents/:id

Downloads a PDF file.

**Response (200 OK):**

```
Content-Type: application/pdf
Content-Disposition: attachment; filename="blood_report.pdf"

<PDF binary data>
```

**Error Response (404 Not Found):**

```json
{
  "error": "Document not found"
}
```

---

#### DELETE /documents/:id

Deletes file from filesystem and database record.

**Response (200 OK):**

```json
{
  "message": "Document deleted successfully"
}
```

**Error Response (404 Not Found):**

```json
{
  "error": "Document not found"
}
```

---

## 🔄 4. Data Flow Description

### 📝 Upload Flow

1. User selects a PDF file through the file input in the UI
2. React frontend sends `multipart/form-data` request to `/documents/upload`
3. Backend validates file type (must be PDF) and size constraints
4. Multer middleware saves the file to the `uploads/` directory with a unique filename
5. SQLite stores document metadata (original name, filename, file path, size, created_at timestamp)
6. API returns success response with document details
7. Frontend updates the document list without page reload
8. New file appears instantly in the document list with upload timestamp

### 📤 Download Flow

1. User clicks the "Download" button on a specific document
2. Frontend sends GET request to `/documents/:id`
3. Backend retrieves the file path from the SQLite database
4. Express streams the file to the browser with `Content-Disposition: attachment` header
5. Browser initiates file download with original filename

### 🗑️ Delete Flow

1. User clicks the "Delete" button on a specific document
2. Frontend sends DELETE request to `/documents/:id`
3. Backend removes the physical file from the `uploads/` folder
4. Database record is deleted from the `documents` table
5. Frontend removes the document from the list without page reload

---

## 5. Assumptions & Constraints

- **Single User**: No authentication or multi-user session management required
- **File Type**: Only PDF files are accepted (validated by MIME type and extension)
- **Storage**: Files are stored locally in an `uploads/` folder on the server filesystem
- **File Size**: Files are expected to be reasonably small (no chunked upload support for large files)
- **Deployment**: Application runs locally on `localhost` (not deployed to production cloud environment)
- **Concurrency**: No race condition concerns due to single-user design
- **Data Persistence**: SQLite database file stored alongside the application
- **Error Handling**: Basic error responses for common failure scenarios (invalid file type, missing file, etc.)

---

## 6. Database Schema

### `documents` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER PRIMARY KEY AUTOINCREMENT | Unique document identifier |
| `originalName` | TEXT NOT NULL | Original filename uploaded by user |
| `filename` | TEXT NOT NULL | Unique filename stored on disk |
| `filepath` | TEXT NOT NULL | Full path to file in uploads folder |
| `filesize` | INTEGER NOT NULL | File size in bytes |
| `created_at` | DATETIME DEFAULT CURRENT_TIMESTAMP | Upload timestamp |

---

## 7. Future Enhancements

- Add file preview functionality (PDF viewer in browser)
- Implement search and filtering capabilities
- Add file metadata extraction (page count, document properties)
- Support for additional file types (images, Word documents)
- Batch upload functionality
- User-friendly error messages with toast notifications
- Progress indicators for large file uploads
