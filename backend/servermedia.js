const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4999;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileType = file.fieldname === 'image' ? 'images' : (file.fieldname === 'video' ? 'video' : 'files');
    const uploadPath = path.join(__dirname, '..', 'public', fileType);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileName = uuidv4();
    cb(null, fileName + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/upload/image', upload.single('file'), (req, res) => {
  handleUpload(req, res, 'image');
});

app.post('/upload/video', upload.single('file'), (req, res) => {
  handleUpload(req, res, 'video');
});

app.post('/upload/file', upload.single('file'), (req, res) => {
  handleUpload(req, res, 'files');
});

function handleUpload(req, res, fileType) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const filePath = path.join(__dirname, '..', 'public', fileType, req.file.filename);

  if (req.file.path !== filePath) {
    try {
      fs.renameSync(req.file.path, filePath);
      return res.json({ message: `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded successfully.`, fileName: req.file.filename });
    } catch (error) {
      console.error('Error renaming file:', error);
      return res.json('Error renaming file:', error);
    }
  }

  return res.json({ message: `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded successfully.`, fileName: req.file.filename });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
