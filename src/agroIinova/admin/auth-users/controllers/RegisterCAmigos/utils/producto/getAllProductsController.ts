// controllers/getAllProductsController.ts
import { Request, Response } from 'express';
import { ProductModel } from '../../../../../../campiamigo/middleware/models/productModel';
import { AuthModel } from '../../../../../../auth/middleware/models/authModel';
import { userProfileModel } from '../../../../../../auth/profile/middleware/models/userProfileModel';

export const getAllProductsController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Traer todos los productos con información del usuario (auth) y perfil (userProfile)
    const allProducts = await ProductModel.findAll({
      include: [
        {
          model: AuthModel,
          attributes: ['id', 'username', 'email','phoneNumber', 'rol', 'status'],
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
              ]
            }
          ]
        }
      ]
    });

    res.status(200).json({
      msg: `Se han obtenido ${allProducts.length} producto(s) en total.`,
      products: allProducts,
      count: allProducts.length
    });
  } catch (error: any) {
    console.error("Error en getAllProductsController:", error);
    res.status(500).json({
      msg: 'Error al obtener todos los productos.',
      error: error.message
    });
  }
};
