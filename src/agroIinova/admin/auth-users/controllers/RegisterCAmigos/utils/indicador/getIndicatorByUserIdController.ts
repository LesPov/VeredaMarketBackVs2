import { Request, Response } from 'express';
import { IndicatorModel } from '../../../../../../campiamigo/middleware/models/indicador';
import { ZoneModel } from '../../../../../../campiamigo/middleware/models/zoneModel';
import { userProfileModel } from '../../../../../../auth/profile/middleware/models/userProfileModel';

export const getIndicatorByUserIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const indicator = await IndicatorModel.findOne({
      where: { userId: id },
      // Especificamos los atributos que queremos obtener, incluidos x, y y z
      attributes: ['id', 'zoneId', 'userId', 'updatedBy', 'color', 'x', 'y', 'z', 'createdAt', 'updatedAt'],
      include: [
        { model: ZoneModel, attributes: ['id', 'name', 'tipoZona', 'zoneImage'] },
        { model: userProfileModel, attributes: ['id', 'firstName', 'lastName'] }
      ]
    });
    if (!indicator) {
      res.status(404).json({ msg: 'No se encontró un indicador para este usuario.' });
      return;
    }
    res.status(200).json({ msg: 'Indicador recuperado correctamente.', indicator });
  } catch (error: any) {
    console.error('Error al recuperar el indicador:', error);
    res.status(500).json({ msg: 'Error del servidor al obtener el indicador.', error: error.message });
  }
};
