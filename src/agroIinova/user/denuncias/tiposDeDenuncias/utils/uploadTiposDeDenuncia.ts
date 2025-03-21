import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * Asegura que el directorio exista antes de guardar el archivo.
 * @param dir - Directorio que se verificará o creará.
 */
const ensureDirectoryExistence = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Se extraen ambos campos para determinar la ruta de subida.
      const { tipo, subtipo } = req.body;
      console.log('Campos recibidos en req.body:', req.body);

      let uploadPath;
      if (tipo) {
          // Si se envía "tipo", se guardará en uploads/tipoDenuncias/<valor de tipo>
          uploadPath = path.join('uploads/tipoDenuncias', tipo);
      } else if (subtipo) {
          // Si se envía "subtipo", se guardará en uploads/subtipoDenuncias/<valor de subtipo>
          uploadPath = path.join('uploads/subtipoDenuncias', subtipo);
      } else {
          return cb(new Error("Tipo o subtipo de denuncia no especificado"), '');
      }
  
      ensureDirectoryExistence(uploadPath);
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      // Puedes agregar lógica para evitar colisiones en nombres de archivos (por ejemplo, agregando un timestamp)
      cb(null, `${Date.now()}-${file.originalname}`);
    }
});
  
const uploadTipoYSubtipoDeDenuncia = multer({ storage: storage }).single('flagImage');
export default uploadTipoYSubtipoDeDenuncia;
