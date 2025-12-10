# 📌 Patient Document Portal

A simple full-stack healthcare web application for managing medical documents.

## 🚀 Overview

This project is a Full Stack Developer Internship assignment that demonstrates a patient's ability to:

✔ Upload PDF medical documents  
✔ View & manage uploaded files  
✔ Download securely  
✔ Delete files when no longer required

This app runs fully locally, ensuring privacy and fast performance.

## ✨ Features

| Feature | Status |
|---------|--------|
| Upload PDF files (validation included) | ✔ |
| View uploaded documents list | ✔ |
| Download documents | ✔ |
| Delete documents | ✔ |
| Metadata stored in DB | ✔ |
| Dark/Light Mode UI 🌗 | ✔ Extra Feature |
| Search & Sorting | ✔ Extra Feature |
| PDF Icons & Date formatting | ✔ Extra Feature |

## 🏗️ Tech Stack

### Frontend
- React + Vite ⚡
- Tailwind CSS 🎨
- Axios (API communication)
- React Icons + Toast UI

### Backend
- Node.js + Express.js
- Multer for file uploads
- SQLite database
- Local storage in `/uploads/` folder

## 📂 Project Structure

```
📦 patient-document-portal
 ┣ 📁 backend
 ┃ ┣ 📁 uploads
 ┃ ┣ 📄 src/index.js
 ┃ ┣ 📄 src/db.js
 ┃ ┣ 📄 package.json
 ┣ 📁 frontend
 ┃ ┣ 📁 src
 ┃ ┣ 📄 package.json
 ┣ 📄 design.md
 ┣ 📄 README.md
```

## ⚙️ How to Run Locally

### 1️⃣ Clone the Repository

```bash
git clone <your-github-repo-url>
cd patient-document-portal
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
node src/index.js
```

**Backend runs at:** 👉 http://localhost:5000

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

**Frontend runs at:** 👉 http://localhost:5173

## 🔌 API Usage Examples (Postman / curl)

### 📤 Upload PDF

```bash
curl -X POST http://localhost:5000/documents/upload \
  -F "file=@./sample.pdf"
```

### 📋 Get all documents

```bash
curl http://localhost:5000/documents
```

### ⬇ Download document

```bash
curl -O http://localhost:5000/documents/1
```

### ❌ Delete document

```bash
curl -X DELETE http://localhost:5000/documents/1
```

## 🧪 Testing Checklist

| Test Action | Expected Result |
|-------------|----------------|
| Upload valid PDF | Shows in list instantly |
| Upload wrong file type | Error toast |
| Download file | Downloads working PDF |
| Delete file | File removed from list + uploads/ folder |
| Dark mode toggle | UI theme updates instantly |

## 🏁 Status

- ✔ Fully completed assignment
- ✔ All frontend + backend features working
- ✔ Documentation included: `design.md` + `README.md`

## 👨‍💻 Author
**Ayush **  
Full Stack Developer (React + Node.js)



---
