import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * Asegura que el directorio de destino exista.
 * @param dir - Directorio que se verificará o creará.
 */
const ensureDirectoryExistence = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join('uploads/zones');
    ensureDirectoryExistence(uploadPath);
    cb(null, uploadPath);
  },
 
  filename: function (req, file, cb) {
    const uploadPath = path.join('uploads/zones');
    const targetPath = path.join(uploadPath, file.originalname);

    // Si el archivo ya existe, reutiliza el nombre y no lo guarda de nuevo
    if (fs.existsSync(targetPath)) {
      // Aquí, simplemente le damos el mismo nombre al archivo ya existente
      cb(null, file.originalname); 
    } else {
      // Si no existe, se guarda con el nombre original
      cb(null, file.originalname);
    }
  }
});

// Middleware de subida con multer (para cityImage y zoneImage)
const uploadZone = multer({ storage: storage }).fields([
  { name: 'cityImage', maxCount: 1 },
  { name: 'zoneImage', maxCount: 1 }
]);

export default uploadZone;
