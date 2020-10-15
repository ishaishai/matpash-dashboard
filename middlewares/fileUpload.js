const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
}).single('excel-file');

module.exports = upload;
