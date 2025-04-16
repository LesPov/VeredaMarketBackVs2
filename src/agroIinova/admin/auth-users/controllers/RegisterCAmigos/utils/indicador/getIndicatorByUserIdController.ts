import { Request, Response } from 'express';
import { AuthModel } from '../../../../../../auth/middleware/models/authModel';
import { userProfileModel } from '../../../../../../auth/profile/middleware/models/userProfileModel';
import { IndicatorModel } from '../../../../../../campiamigo/middleware/models/indicador';
import { ProductModel } from '../../../../../../campiamigo/middleware/models/productModel';
import { ZoneModel } from '../../../../../../campiamigo/middleware/models/zoneModel';

export const getIndicatorByUserIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    // El id que se recibe debe ser el userProfile.id
    const { id } = req.params;

    const indicator = await IndicatorModel.findOne({
      where: { userId: id },  // userId de 'indicator' es el userProfile.id
      attributes: ['id', 'zoneId', 'userId', 'updatedBy', 'color', 'x', 'y', 'z', 'createdAt', 'updatedAt'],
      include: [
        {
          model: ZoneModel,
          attributes: ['id', 'name', 'tipoZona', 'zoneImage'] 
        },
        {
          model: userProfileModel,
          attributes: [
            'id',
            'userId', // Este campo almacena el auth.id
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
            {
              model: AuthModel,
              attributes: ['id', 'email', 'phoneNumber'],
              include: [
                {
                  model: ProductModel,
                  as: 'products', // Alias definido en la relación
                  attributes: ['id', 'name', 'description', 'price', 'image', 'glbFile', 'video']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!indicator) {
      res.status(404).json({ msg: 'No se encontró un indicador para este userProfile.id.' });
      return;
    }

    res.status(200).json({ msg: 'Indicador recuperado correctamente.', indicator });
  } catch (error: any) {
    console.error('Error al recuperar el indicador:', error);
    res.status(500).json({ msg: 'Error del servidor al obtener el indicador.', error: error.message });
  }
};
