import { Request, Response } from 'express';
import { errorMessages } from "../../../../auth/middleware/errors/errorMessages";
import upload from "../../../../auth/profile/utils/uploadConfig";
import { SubtipoDenunciaModel } from "../../middleware/models/subtipoDenunciaModel";
import { TipoDenunciaModel } from "../../middleware/models/tipoDenunciaModel";
import uploadTipoYSubtipoDeDenuncia from '../../tiposDeDenuncias/utils/uploadTiposDeDenuncia';

// Función para buscar el tipo de denuncia por ID
export const findTipoDenunciaById = async (tipoDenunciaId: number) => {
    return await TipoDenunciaModel.findByPk(tipoDenunciaId);
};

// Función de validación simple para la imagen (ajústala según tus reglas)
const validateImageUpload = (req: Request, res: Response): boolean => {
    if (!req.file) {
        res.status(400).json({
            msg: 'No se ha enviado ninguna imagen.',
            errors: 'Archivo requerido'
        });
        return false;
    }
    return true;
};

// Manejo de errores de subida de imagen
export const handleImageUploadError = (err: any, res: Response) => {
    console.error(`Error en la subida de la imagen: ${err.message}`);
    res.status(400).json({
        msg: `Error en la subida de la imagen: ${err.message}`,
        errors: 'Error al cargar la imagen',
    });
};

// Encapsula la lógica de subida de imagen
const handleImageUpload = (req: Request, res: Response, callback: () => Promise<void>) => {
 
    uploadTipoYSubtipoDeDenuncia(req, res, (err) => {
        if (err) {
            return handleImageUploadError(err, res);
        }
        callback();
    });
};

// Controlador para crear un subtipo de denuncia con imagen
export const creaSubtipoDenuncia = async (req: Request, res: Response) => {
    // Se marca el registro como subtipo
    req.body.subtipo = 'subtipo';
    try {
        handleImageUpload(req, res, async () => {
            // Validación: se requiere que se envíe el archivo
            if (!validateImageUpload(req, res)) return;

            const { nombre, descripcion, tipoDenunciaId } = req.body;
            const flagImage = req.file?.filename || null;

            // Verifica si el tipo de denuncia existe
            const tipoDenuncia = await findTipoDenunciaById(tipoDenunciaId);
            if (!tipoDenuncia) {
                res.status(404).json({
                    message: `El tipo de denuncia con ID ${tipoDenunciaId} no existe.`
                });
                return;
            }

            // Crea el registro del subtipo de denuncia
            const subtipoDenuncia = await SubtipoDenunciaModel.create({
                nombre,
                descripcion,
                tipoDenunciaId,
                flagImage,
            });

            res.status(201).json({
                message: 'Subtipo de denuncia creado con éxito',
                subtipoDenuncia
            });
        });
    } catch (error) {
        console.error("Error en el controlador de subtipo:", error);
        if (!res.headersSent) {
            res.status(400).json({
                msg: (error as Error).message || errorMessages.databaseError,
                error,
            });
        }
    }
};
