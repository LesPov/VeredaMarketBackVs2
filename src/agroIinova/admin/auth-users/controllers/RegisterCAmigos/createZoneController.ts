import { Request, Response } from 'express';
import { userProfileModel } from '../../../../auth/profile/middleware/models/userProfileModel';
import { ZoneModel } from '../../../../campiamigo/middleware/models/zoneModel';
import { IndicatorModel } from '../../../../campiamigo/middleware/models/indicador';
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
  // Forzamos algún campo si es necesario
  req.body.zonasactualizar = 'zonasactualizar';

  try {
    // Extraer el id del usuario (perfil) de los parámetros
    const { id } = req.params;
    // Buscar el perfil del usuario
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

    // Manejar la subida de imágenes y proceder con la lógica de zona
    handleZoneImageUpload(req, res, async (): Promise<void> => {
      // Extraer los datos de la zona (después de procesar archivos)
      const { name, tipoZona, description, climate, departamentoName } = req.body;
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
          // Caso atípico: el perfil tiene un zoneId pero no se encuentra la zona
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
        // Si no existe zona asignada, se crea y se actualiza el perfil
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

      // Crear el indicador si aún no existe para el usuario
      const existingIndicator = await IndicatorModel.findOne({ where: { userId: userProfile.id } });
      if (!existingIndicator) {
        await IndicatorModel.create({
          zoneId: zone.id,
          userId: userProfile.id,
          color: 'white'
        });
      }

      // Responder con la información de la zona actualizada/creada
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
