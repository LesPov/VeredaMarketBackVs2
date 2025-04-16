// getIndicatorByUserIdController.ts
import { Request, Response } from 'express';
import { IndicatorModel } from '../../../../../../campiamigo/middleware/models/indicador';
import { ZoneModel } from '../../../../../../campiamigo/middleware/models/zoneModel';
import { userProfileModel } from '../../../../../../auth/profile/middleware/models/userProfileModel';
import { AuthModel } from '../../../../../../auth/middleware/models/authModel';
import { ProductModel } from '../../../../../../campiamigo/middleware/models/productModel';

export const getIndicatorByUserIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const indicator = await IndicatorModel.findOne({
      where: { userId: id },
      attributes: ['id', 'zoneId', 'userId', 'updatedBy', 'color', 'x', 'y', 'z', 'createdAt', 'updatedAt'],
      include: [
        // Información de la zona asociada
        {
          model: ZoneModel,
          attributes: ['id', 'name', 'tipoZona', 'zoneImage']
        },
        // Perfil completo del usuario
        {
          model: userProfileModel,
          attributes: [
            'id',
            'userId',
            'profilePicture',
            'firstName',
            'lastName',
            'identificationType',
            'identificationNumber',
            'biography',
            'direccion',
            'birthDate',
            'gender',
            'status',
            'campiamigo',
            'zoneId',
            'createdAt',
            'updatedAt'
          ],
          include: [
            // Desde el perfil se incluye el usuario (Auth)
            {
              model: AuthModel,
              attributes: ['id', 'email', 'phoneNumber'],
              include: [
                {
                  model: ProductModel,
                  as: 'products', // usamos el alias definido
                  attributes: ['id', 'name', 'description', 'price', 'image', 'glbFile', 'video']
                }
              ]
            }
          ]
        }
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
