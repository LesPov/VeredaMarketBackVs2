// uploadConfig.ts (Configuración de multer)
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
        const { perfilCampesino,  } = req.body;
        console.log('req.body:', req.body); // Para verificar si `perfilCampesino`  se envían correctamente
    
        let uploadPath;
        if (perfilCampesino) {
            uploadPath = path.join('uploads/perilCampesino', perfilCampesino);
        }
         else {
            return cb(new Error("imagen de perfil no especificada no especificada"), '');
        }
    
        ensureDirectoryExistence(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname}`);
    }
});

// Configuración de multer para manejo de archivos
const upload = multer({ storage: storage }).single('profilePicture');

export default upload;
