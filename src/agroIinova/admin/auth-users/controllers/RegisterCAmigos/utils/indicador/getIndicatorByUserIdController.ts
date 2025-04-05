// src/campiamigo/middleware/controllers/RegisterCAmigos/utils/indicador/getIndicatorByUserIdController.ts
import { Request, Response } from 'express';
import { IndicatorModel } from '../../../../../../campiamigo/middleware/models/indicador';
import { ZoneModel } from '../../../../../../campiamigo/middleware/models/zoneModel';
import { userProfileModel } from '../../../../../../auth/profile/middleware/models/userProfileModel';

export const getIndicatorByUserIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const indicator = await IndicatorModel.findOne({
      where: { userId: id },
      include: [
        { model: ZoneModel,       attributes: ['id','name','tipoZona','zoneImage'] },
        { model: userProfileModel,attributes: ['id','firstName','lastName'] }
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
