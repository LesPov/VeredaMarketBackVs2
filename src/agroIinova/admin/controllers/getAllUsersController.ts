import { Request, Response } from 'express';
import { AuthModel } from '../../auth/middleware/models/authModel';
import { userProfileModel } from '../../auth/profile/middleware/models/userProfileModel';
import { errorMessages } from '../../auth/middleware/errors/errorMessages';

export const getAllUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Consulta todos los usuarios de la tabla auth, incluyendo solo el campo profilePicture del perfil asociado
    const users = await AuthModel.findAll({
      attributes: ['id', 'username', 'email', 'rol', 'status'], // datos de la tabla auth
      include: [
        {
          model: userProfileModel,
          attributes: ['profilePicture'], // únicamente la imagen del perfil
        },
      ],
    });
    
    res.status(200).json(users);
  } catch (error: any) {
    console.error("Error in getAllUsersController:", error);
    res.status(500).json({
      msg: error.message || errorMessages.databaseError,
      error,
    });
  }
};
