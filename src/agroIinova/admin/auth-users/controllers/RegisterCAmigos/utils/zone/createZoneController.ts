import { Request, Response } from 'express';
import { ZoneModel } from '../../../../../../campiamigo/middleware/models/zoneModel';
import uploadZone from './uploadZoneConfig';

/**
 * Helper para manejar la subida de imágenes de la zona.
 * Utiliza el middleware configurado para la subida de archivos (Multer).
 */
const handleZoneImageUpload = (req: Request, res: Response, callback: () => Promise<void>): void => {
  uploadZone(req, res, (err: any) => {
    if (err) {
      console.error("Error en la subida de imágenes de zona:", err.message);
      res.status(400).json({
        msg: `Error en la subida de imágenes de zona: ${err.message}`,
        errors: 'Error al cargar las imágenes'
      });
      return; // Finaliza sin devolver valor
    }
    callback();
  });
};

/**
 * Controlador para crear nuevas zonas.
 * Se espera que la petición incluya los campos: name, tipoZona, description, climate y departamentoName,
 * además de los archivos opcionales cityImage y zoneImage.
 */
export const createZoneController = async (req: Request, res: Response): Promise<void> => {
  handleZoneImageUpload(req, res, async (): Promise<void> => {
    try {
      // Extraer datos de la zona desde el cuerpo de la petición
      const { name, tipoZona, description, climate, departamentoName } = req.body;
      
      // Comprobación de duplicados: buscar si ya existe una zona con el mismo nombre y departamento
      const existingZone = await ZoneModel.findOne({
        where: { 
          name, 
          departamentoName 
        }
      });

      // Si se encuentra la zona, se responde inmediatamente y se termina la ejecución
      if (existingZone) {
        res.status(400).json({
          msg: 'Ya existe una zona con ese nombre y departamento.'
        });
        return;
      }

      // Extraer archivos subidos (si los hay) para las imágenes
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const cityImage = files && files.cityImage ? files.cityImage[0].filename : undefined;
      const zoneImage = files && files.zoneImage ? files.zoneImage[0].filename : undefined;

      // Crear una nueva zona en la base de datos
      const newZone = await ZoneModel.create({
        name,
        tipoZona,
        description,
        climate,
        departamentoName,
        cityImage,
        zoneImage,
      });

      // Responder con la información de la zona creada
      res.status(201).json({
        msg: 'Zona creada correctamente.',
        zone: newZone,
      });
      return;
    } catch (error: any) {
      console.error('Error en createZoneController:', error);

      // Se puede detectar el error de restricción única y enviar un mensaje amigable
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({
          msg: 'La combinación de nombre de zona y departamento ya existe.',
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        msg: 'Error al crear la zona.',
        error: error.message,
      });
      return;
    }
  });
};
