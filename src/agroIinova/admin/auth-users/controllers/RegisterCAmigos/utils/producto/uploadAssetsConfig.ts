// uploadAssetsConfig.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * Verifica si el directorio existe y, si no, lo crea.
 * @param dir - Directorio de destino.
 */
const ensureDirectoryExistence = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determinar el subdirectorio según el campo del formulario
    let subfolder = '';
    if (file.fieldname === 'imagenes') {
      subfolder = 'imagenes';
    } else if (file.fieldname === 'videos') {
      subfolder = 'videos';
    } else if (file.fieldname === 'modelos') {
      subfolder = 'modelos';
    } else {
      subfolder = '';
    }
    // Construye la ruta de destino: uploads/productos/<subfolder>
    const uploadPath = path.join('uploads', 'productos', subfolder);
    ensureDirectoryExistence(uploadPath);
    // Opcionalmente, puedes almacenar el subfolder en el objeto file para usos futuros
    (file as any).subfolder = subfolder;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    // Se le añade un timestamp para evitar nombres duplicados
    const finalFileName = `${baseName}-${Date.now()}${ext}`;
    cb(null, finalFileName);
  },
});

const limits = {
  // Límite de 50 MB por archivo, ajustable según las necesidades
  fileSize: 50 * 1024 * 1024,
};

const uploadAssets = multer({ storage, limits }).fields([
  { name: 'imagenes', maxCount: 3 },
  { name: 'videos', maxCount: 2 },
  { name: 'modelos', maxCount: 2 },
]);

export default uploadAssets;
