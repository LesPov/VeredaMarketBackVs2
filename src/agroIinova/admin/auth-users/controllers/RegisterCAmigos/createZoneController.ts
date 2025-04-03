import { Request, Response } from 'express';
import { userProfileModel } from '../../../../auth/profile/middleware/models/userProfileModel';
import { ZoneModel } from '../../../../campiamigo/middleware/models/zoneModel';

/**
 * Controlador para actualizar (o crear y asignar) una zona a un usuario campiamigo.
 * Se espera recibir el id del usuario en los parámetros de la URL y los datos de la zona en el body.
 */
export const createZoneController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Convertir el parámetro userId a número
    const { id } = req.params;
    // Extraer los datos de la zona del body
    const { name, tipoZona, description, climate } = req.body;

    // Buscar el perfil del usuario según su userId
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

    let zone;
    if (userProfile.zoneId) {
      // Si ya existe una zona asignada, se busca y se actualiza
      zone = await ZoneModel.findByPk(userProfile.zoneId);
      if (zone) {
        await zone.update({ name, tipoZona, description, climate });
      } else {
        // Caso atípico: existe un zoneId en el perfil pero la zona no se encuentra
        zone = await ZoneModel.create({ name, tipoZona, description, climate });
        await userProfileModel.update({ zoneId: zone.id }, { where: { id } });
      }
    } else {
      // Si no existe zona asignada, se crea una nueva y se actualiza el perfil
      zone = await ZoneModel.create({ name, tipoZona, description, climate });
      await userProfileModel.update({ zoneId: zone.id }, { where: { id } });
    }

    // Responder con la información de la zona actualizada/creada
    res.status(200).json({
      msg: 'Zona actualizada correctamente.',
      zone,
    });
  } catch (error: any) {
    console.error('Error en createZoneController:', error);
    res.status(500).json({
      msg: 'Error al actualizar la zona.',
      error: error.message,
    });
  }
};
