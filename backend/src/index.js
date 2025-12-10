require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
  file.mimetype === 'application/pdf'
    ? cb(null, true)
    : cb(new Error('Only PDF files are allowed'));
};

const upload = multer({ storage, fileFilter });

// Health check
app.get('/', (req, res) => res.json({ message: "API is running" }));


// 1️⃣ Upload PDF
app.post('/documents/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const { filename, originalname, path: filepath, size } = req.file;

  db.run(
    `INSERT INTO documents (filename, originalName, filepath, filesize) VALUES (?, ?, ?, ?)`,
    [filename, originalname, filepath, size],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        message: 'File uploaded successfully',
        document: { id: this.lastID, filename, originalname, filepath, size }
      });
    }
  );
});


// 2️⃣ List all documents
app.get('/documents', (req, res) => {
  db.all(`SELECT * FROM documents ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// 3️⃣ Download PDF
app.get('/documents/:id', (req, res) => {
  db.get(`SELECT * FROM documents WHERE id = ?`, [req.params.id], (err, doc) => {
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    res.download(doc.filepath, doc.originalName);
  });
});


// 4️⃣ Delete PDF
app.delete('/documents/:id', (req, res) => {
  db.get(`SELECT * FROM documents WHERE id = ?`, [req.params.id], (err, doc) => {
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    fs.unlink(doc.filepath, () => {
      db.run(`DELETE FROM documents WHERE id = ?`, [req.params.id], () => {
        res.json({ message: 'Document deleted successfully' });
      });
    });
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
