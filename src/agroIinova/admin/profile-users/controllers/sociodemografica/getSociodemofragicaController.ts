import { Request, Response } from 'express';
import SocioDemographicModel from '../../../profile-users/middleware/models/socioDemographic.model';

/**
 * Controlador GET para obtener la información sociodemográfica de un usuario por su ID.
 * Se espera que el parámetro de la ruta contenga el ID del usuario.
 */
export const getSociodemograficaController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extraemos el id del usuario desde los parámetros de la URL.
    const { id } = req.params;
    
    // Buscamos el registro sociodemográfico asociado al usuario.
    const socioInfo = await SocioDemographicModel.findOne({ where: { userId: id } });
    
    // Si no se encuentra el registro, respondemos con 404.
    if (!socioInfo) {
      res.status(404).json({ msg: 'Información sociodemográfica no encontrada' });
      return;
    }
    
    // Retornamos la información encontrada con estado 200.
    res.status(200).json(socioInfo);
  } catch (error: any) {
    console.error("Error en getSociodemograficaController:", error);
    res.status(500).json({
      msg: error.message || 'Error en el servidor al obtener la información sociodemográfica',
      error
    });
  }
};
