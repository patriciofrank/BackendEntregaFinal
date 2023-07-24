import fileDirName from './path.js';
import multer from 'multer';

const { __dirname } = fileDirName(import.meta);

//Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "documents";
    if (file.fieldname === "profileImage") {
      folder = "profiles";
    } else if (file.fieldname === "productImage") {
      folder = "products";
    }
    cb(null,'src/public/'+ folder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage: storage });