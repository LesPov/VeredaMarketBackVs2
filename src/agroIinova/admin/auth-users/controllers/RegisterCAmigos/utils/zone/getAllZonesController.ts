import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { ZoneModel } from '../../../../../../campiamigo/middleware/models/zoneModel';
import { userProfileModel } from '../../../../../../auth/profile/middleware/models/userProfileModel';

export const getAllZonesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { climate, departamentoName, tipoZona, description } = req.query;
    const where: any = {};
    if (climate) where.climate = climate;
    if (departamentoName) where.departamentoName = departamentoName;
    if (tipoZona) where.tipoZona = tipoZona; 
    if (description) where.description = { [Op.like]: `%${description}%` };

    const zones = await ZoneModel.findAll({
      where,
      include: [{
        model: userProfileModel,
        // aquí pedimos el userId (y si quieres también el id del perfil, añádelo)
        attributes: ['id', 'userId']
      }]
    });

    res.status(200).json({
      msg: 'Zonas recuperadas correctamente.',
      zones
    });
  } catch (error: any) {
    console.error('Error en getAllZonesController:', error);
    res.status(500).json({
      msg: 'Error al recuperar las zonas.',
      error: error.message
    });
  }
};
