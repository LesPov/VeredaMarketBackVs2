import { Request, Response } from 'express';
import { Op } from 'sequelize'; // Se importa Op correctamente
import { ZoneModel } from '../../../../campiamigo/middleware/models/zoneModel';

/**
 * Controlador para obtener todas las zonas, opcionalmente filtradas por clima, ciudad, tipo de zona y descripción.
 */
export const getAllZonesController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extraer los parámetros de consulta desde la URL
    const { climate, departamentoName, tipoZona, description } = req.query;
    const query: any = {};

    // Filtrar por clima si se proporciona
    if (climate) {
      query.climate = climate;
    }
    // Filtrar por nombre de ciudad
    if (departamentoName) {
      query.departamentoName = departamentoName;
    }
    // Filtrar por tipo de zona
    if (tipoZona) {
      query.tipoZona = tipoZona;
    }
    // Filtrar por descripción con operador LIKE para coincidencias parciales
    if (description) {
      query.description = { [Op.like]: `%${description}%` }; // Uso correcto de Op.like con backticks
    }

    // Buscar zonas en la base de datos con los filtros aplicados
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
