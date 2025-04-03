import { Request, Response } from 'express';
import { ZoneModel } from '../../../../campiamigo/middleware/models/zoneModel';

/**
 * Controlador para obtener todas las zonas.
 * Consulta la base de datos y retorna un listado con todas las zonas registradas.
 */
export const getAllZonesController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Buscar todas las zonas en la base de datos.
    const zones = await ZoneModel.findAll();

    // Retornar la lista de zonas.
    res.status(200).json({
      msg: 'Zonas recuperadas correctamente.',
      zones
    });
  } catch (error: any) {
    console.error('Error en getAllZonesController:', error);
    res.status(500).json({
      msg: 'Error al recuperar las zonas.',
      error: error.message,
    });
  }
};
