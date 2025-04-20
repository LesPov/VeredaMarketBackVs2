// controllers/getProductByIdController.ts
import { Request, Response } from 'express';
import { AuthModel } from '../../../../../../auth/middleware/models/authModel';
import { userProfileModel } from '../../../../../../auth/profile/middleware/models/userProfileModel';
import { ProductModel } from '../../../../../../campiamigo/middleware/models/productModel';
import { TagModel } from '../../../../../../campiamigo/middleware/models/tagModel';
import { ZoneModel } from '../../../../../../campiamigo/middleware/models/zoneModel';
 
export const getProductByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
       res.status(400).json({ msg: '"id" de producto inválido.' });
    }

    const product = await ProductModel.findByPk(productId, {
      include: [
        {
          model: AuthModel,
          attributes: ['id', 'email', 'phoneNumber', 'rol', 'status'],
          include: [
            {
              model: userProfileModel,
              attributes: [
                'id',
                'firstName',
                'lastName',
                'profilePicture', 
                'identificationType',
                'identificationNumber', 
                'birthDate',
                'gender', 
                'biography',
                'direccion',
                'campiamigo',
                'status',
                'zoneId'
              ],
              include: [
                {
                  model: ZoneModel,
                  attributes: [
                    'id',
                    'name',
                    'departamentoName',
                    'tipoZona',
                    'climate',
                    'cityImage',
                    'zoneImage'
                  ]
                },
                {
                  model: TagModel,
                  as: 'tags',
                  attributes: ['id', 'name', 'color']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!product) {
       res.status(404).json({ msg: 'Producto no encontrado.' });
    }

    res.status(200).json({
      msg: 'Producto encontrado.',
      product
    });
  } catch (error: any) {
    console.error("Error en getProductByIdController:", error);
    res.status(500).json({ msg: 'Error al obtener el producto.', error: error.message });
  }
};
