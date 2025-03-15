import { Request, Response } from 'express';
import { errorMessages } from '../../../middleware/errors/errorMessages';
import { CustomRequest } from '../../../middleware/valdiateToken/validateToken';
import { errorMessagesCp } from '../../../../campesinos/middleware/errors/errorsMessagesCp';
import { successMessagesCp } from '../../../../campesinos/middleware/succes/succesMessagesCp';
import { userProfileModel } from '../../middleware/models/userProfileModel';
import upload from '../../utils/uploadConfig';
import { Op } from 'sequelize';

// Función para manejar la subida de imagen
const handleImageUpload = (req: Request, res: Response, callback: () => Promise<void>) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(`Error en la subida de la imagen: ${err.message}`);
            return res.status(400).json({
                msg: `Error en la subida de la imagen: ${err.message}`,
                errors: 'Error al cargar la imagen',
            });
        }
        callback();
    });
};

// Función para validar los datos personales usando el campo birthDate (fecha de nacimiento)
export const validateCampesinoPersonalData = (
    firstName: string,
    lastName: string,
    identificationNumber: string,
    identificationType: string,
    birthDate: string,
    gender: string,
    profilePicture?: string // Ahora es opcional
): string[] => {
    const errors: string[] = [];
    // Se valida que los campos obligatorios estén presentes (excepto la imagen)
    if (!firstName || !lastName || !identificationNumber || !identificationType || !birthDate || !gender) {
        errors.push(errorMessagesCp.requiredFields);
    }
    // Validamos que birthDate sea una fecha válida
    if (birthDate && isNaN(Date.parse(birthDate))) {
        errors.push("La fecha de nacimiento no es válida.");
    }
    return errors;
};


export const processValidationErrors = (errors: string[], res: Response): void => {
    if (errors.length > 0) {
        res.status(400).json({
            msg: errors,
            error: 'Error en la validación de la entrada de datos',
        });
        throw new Error("Input validation failed");
    }
};

export const processServerError = (error: any, res: Response) => {
    console.error("Error en updateProfileController:", error);
    if (!res.headersSent) {
        res.status(400).json({
            msg: error.message || errorMessages.databaseError,
            error,
        });
        throw new Error("Controller updateProfileController error");
    }
};

export const sendSuccessResponse = (message: string, res: Response): void => {
    res.status(200).json({ msg: message });
};

/**
 * Controlador PUT para actualizar los datos personales del usuario.
 * Se asume que el perfil ya existe. Si no se encuentra, se retorna un 404.
 */
export const updateProfileController = async (req: CustomRequest, res: Response): Promise<void> => {
    req.body.perfilactualizar = 'perfilactualizar';

    handleImageUpload(req, res, async (): Promise<void> => {
        try {
            const userId = req.user ? req.user.userId : null;
            if (!userId) {
                res.status(401).json({ msg: 'Usuario no autenticado' });
                return;
            }

            // Extraemos los datos enviados
            const {
                firstName,
                lastName,
                identificationNumber,
                identificationType,
                biography,
                direccion,
                birthDate,
                gender,
                campiamigo,
            } = req.body;

            // Extraemos la imagen solo si se subió
            const profilePicture: string | undefined = req.file?.filename;

            // Validamos los datos obligatorios (la imagen ya no es obligatoria)
            const validationErrors = validateCampesinoPersonalData(
                firstName,
                lastName,
                identificationNumber,
                identificationType,
                birthDate,
                gender,
                profilePicture // Puede ser undefined
            );
            processValidationErrors(validationErrors, res);

            // Verificamos duplicados: número de identificación
            const duplicateIdentification = await userProfileModel.findOne({
                where: {
                    identificationNumber,
                    userId: { [Op.ne]: userId }
                }
            });
            if (duplicateIdentification) {
                res.status(400).json({
                    msg: 'El número de identificación ya está registrado',
                    error: 'Número de identificación duplicado'
                });
                return;
            }

            // Opcional: verificación de nombre y apellido
            const duplicateName = await userProfileModel.findOne({
                where: {
                    firstName,
                    lastName,
                    userId: { [Op.ne]: userId }
                }
            });
            if (duplicateName) {
                res.status(400).json({
                    msg: 'El nombre ya está registrado',
                    error: 'Nombre duplicado'
                });
                return;
            }

            // Buscamos el perfil existente del usuario
            const existingProfile = await userProfileModel.findOne({ where: { userId } });
            if (!existingProfile) {
                res.status(404).json({ msg: 'Perfil no encontrado para actualizar' });
                return;
            }

            const campiamigoBoolean = campiamigo === true || campiamigo === 'true';

            // Construimos el objeto de actualización; solo incluimos la imagen si se proporcionó
            const updateData: any = {
                firstName,
                lastName,
                identificationNumber,
                identificationType,
                biography,
                direccion,
                birthDate,
                gender,
                campiamigo: campiamigoBoolean,
            };

            if (profilePicture) {
                updateData.profilePicture = profilePicture;
            }

            // Actualizamos el perfil existente
            await existingProfile.update(updateData);

            sendSuccessResponse(successMessagesCp.personalDataRegistered, res);
            return;
        } catch (error: any) {
            processServerError(error, res);
            return;
        }
    });
};
