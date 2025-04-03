import { Request, Response } from 'express';
import { ZoneModel } from '../../../../campiamigo/middleware/models/zoneModel';

/**
 * Controlador para obtener todas las zonas, opcionalmente filtradas por clima.
 */
export const getAllZonesController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Si se envía el parámetro query 'climate', se utiliza para filtrar
    const { climate } = req.query;
    const query: any = {};
    if (climate) {
      query.climate = climate;
    }

    // Buscar zonas según el filtro (o todas si no se filtra)
    const zones = await ZoneModel.findAll({ where: query });

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
