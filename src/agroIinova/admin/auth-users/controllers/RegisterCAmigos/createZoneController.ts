import { Request, Response } from 'express';
import { userProfileModel } from '../../../../auth/profile/middleware/models/userProfileModel';
import { ZoneModel } from '../../../../campiamigo/middleware/models/zoneModel';
import uploadZone from './utils/uploadZoneConfig';

/**
 * Helper para manejar la subida de imágenes para la zona.
 */
const handleZoneImageUpload = (req: Request, res: Response, callback: () => Promise<void>) => {
  uploadZone(req, res, (err: any) => {
    if (err) {
      console.error("Error en la subida de imágenes de zona:", err.message);
      return res.status(400).json({
        msg: `Error en la subida de imágenes de zona: ${err.message}`,
        errors: 'Error al cargar las imágenes'
      });
    }
    callback();
  });
};

export const createZoneController = async (req: Request, res: Response): Promise<void> => {
  // Si necesitas forzar algún campo, lo puedes dejar
  req.body.zonasactualizar = 'zonasactualizar';
  console.log("Contenido de req.body antes de subir archivos:", req.body);

  try {
    // Extraer el id del usuario de los parámetros
    const { id } = req.params;
    // Buscar el perfil del usuario por su id
    const userProfile = await userProfileModel.findOne({ where: { id } });
    if (!userProfile) {
      res.status(404).json({ msg: 'Perfil de usuario no encontrado.' });
      return;
    }

    // Verificar que el usuario sea campiamigo
    if (!userProfile.getDataValue('campiamigo')) {
      res.status(400).json({ msg: 'El usuario no es campiamigo y no se le puede asignar una zona.' });
      return;
    }

    // Manejar la subida de imágenes para la zona y luego proceder con la lógica
    handleZoneImageUpload(req, res, async (): Promise<void> => {
      // Extraer los datos de la zona *después* de que Multer procese la solicitud
      const { name, tipoZona, description, climate, departamentoName } = req.body;
      console.log("Campos de texto recibidos:", { name, tipoZona, description, climate, departamentoName });
      
      // Acceder a los archivos subidos
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const cityImage = files && files.cityImage ? files.cityImage[0].filename : undefined;
      const zoneImage = files && files.zoneImage ? files.zoneImage[0].filename : undefined;

      let zone;
      if (userProfile.zoneId) {
        // Si ya existe una zona asignada, se busca y se actualiza
        zone = await ZoneModel.findByPk(userProfile.zoneId);
        if (zone) {
          await zone.update({
            name,
            tipoZona,
            description,
            climate,
            departamentoName,
            cityImage,
            zoneImage
          });
        } else {
          // Caso atípico: existe un zoneId en el perfil pero la zona no se encuentra
          zone = await ZoneModel.create({
            name,
            tipoZona,
            description,
            climate,
            departamentoName,
            cityImage,
            zoneImage
          });
          await userProfileModel.update({ zoneId: zone.id }, { where: { id } });
        }
      } else {
        // Si no existe zona asignada, se crea una nueva y se actualiza el perfil
        zone = await ZoneModel.create({
          name,
          tipoZona,
          description,
          climate,
          departamentoName,
          cityImage,
          zoneImage
        });
        await userProfileModel.update({ zoneId: zone.id }, { where: { id } });
      }

      // Responder con la información de la zona creada/actualizada
      res.status(200).json({
        msg: 'Zona actualizada correctamente.',
        zone,
      });
    });
  } catch (error: any) {
    console.error('Error en createZoneController:', error);
    res.status(500).json({
      msg: 'Error al actualizar la zona.',
      error: error.message,
    });
  }
};
