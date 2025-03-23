import { Request, Response } from 'express';
import { TipoDenunciaModel } from '../../../middleware/models/tipoDenunciaModel';
import { SubtipoDenunciaModel } from '../../../middleware/models/subtipoDenunciaModel';
import { DenunciaAnonimaModel } from '../../../middleware/models/denunciasAnonimasModel';
import { successMessages } from '../../../../../auth/middleware/success/successMessages';
import { errorMessages } from '../../../../../auth/middleware/errors/errorMessages';

/**
 * Valida la clave única recibida.
 * @param claveUnica - La clave única a validar.
 * @returns Un arreglo de errores de validación (si los hay).
 */
const validateClaveUnica = (claveUnica: string): string[] => {
    const errors: string[] = [];
    // Verifica si la clave única está vacía o mal formada.
    if (!claveUnica || claveUnica.trim() === '') { 
        errors.push('La clave única es requerida y no puede estar vacía.');
    }
    return errors;
};

/**
 * Maneja los errores de validación de entrada sin lanzar excepción.
 * Envía la respuesta de error si se detectan errores.
 * @param errors - Arreglo de errores.
 * @param res - Objeto de respuesta Express.
 * @returns true si hay errores de validación, false en caso contrario.
 */
const handleInputValidationErrors = (errors: string[], res: Response): boolean => {
    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            message: 'Error en la validación de los datos.',
            errors: errors
        });
        return true; // Se indica que hubo error de validación.
    } 
    return false; // No hubo errores de validación.
};

/**
 * Busca una denuncia anónima por clave única, incluyendo sus relaciones con Tipo y Subtipo.
 * @param claveUnica - La clave única de la denuncia.
 * @returns La denuncia encontrada o null si no se encuentra.
 */
const findDenunciaWithRelations = async (claveUnica: string) => {
    return await DenunciaAnonimaModel.findOne({ 
        where: { claveUnica },
        include: [
            {
                model: TipoDenunciaModel,
                as: 'TipoDenuncia',
                attributes: ['id', 'nombre'],
                required: true,
            },
            {
                model: SubtipoDenunciaModel,
                as: 'SubtipoDenuncia',
                attributes: ['id', 'nombre'],
                required: true,
            }
        ],
        attributes: [
            'id',
            'descripcion',
            'direccion',
            'status',
            'claveUnica',
            'pruebas',
            'audio',
            'tieneEvidencia',
            'createdAt',
            'updatedAt',
            'tipoDenunciaId',
            'subtipoDenunciaId',
        ]
    });
};

/**
 * Maneja la respuesta exitosa enviando la denuncia encontrada con sus relaciones y URLs
 * actualizadas para pruebas (evidencias) y audio.
 * 
 * Nota: Actualmente se utilizan rutas locales (http://localhost:2020/...). 
 * Cuando se despliegue el proyecto, recuerda actualizar estas URLs a la ruta correcta del servidor de archivos.
 * 
 * @param res - Objeto de respuesta Express.
 * @param denuncia - Objeto de denuncia obtenido de la base de datos.
 */
const handleSuccessResponse = (res: Response, denuncia: any) => {
    // Verifica que la denuncia cuente con la información de Tipo y Subtipo.
    if (!denuncia.TipoDenuncia || !denuncia.SubtipoDenuncia) {
        throw new Error('No se pudo obtener la información completa de tipo o subtipo de denuncia');
    }
    // Procesa los archivos de pruebas: Separa y genera URL según la extensión.
    const pruebasUrls = denuncia.pruebas
        ? denuncia.pruebas.split(',').map((file: string) => {
            const trimmedFile = file.trim();
            // Comprueba si el archivo es de video o imagen según la extensión.
            if (trimmedFile.endsWith('.webm') || trimmedFile.endsWith('.mp4')) {
                return {
                    type: 'video',
                    // TODO: Actualiza la ruta base (http://localhost:2020/) a la URL de producción.
                    url: `http://localhost:2020/uploads/evidenciasDenuncias/videos/${trimmedFile}`
                };
            } else {
                return {
                    type: 'image',
                    // TODO: Actualiza la ruta base (http://localhost:2020/) a la URL de producción.
                    url: `http://localhost:2020/uploads/evidenciasDenuncias/imagenes/${trimmedFile}`
                };
            }
        })
        : [];

    // Procesa el archivo de audio, generando la URL correspondiente.
    const audioUrl = denuncia.audio
        ? // TODO: Actualiza la ruta base (http://localhost:2020/) a la URL de producción.
          `http://localhost:2020/uploads/evidenciasDenuncias/audios/${denuncia.audio}`
        : null;

    res.status(200).json({
        success: true,
        message: successMessages.consultaExitosa,
        denuncia: {
            id: denuncia.id,
            descripcion: denuncia.descripcion,
            direccion: denuncia.direccion,
            status: denuncia.status,
            claveUnica: denuncia.claveUnica,
            tipoDenuncia: {
                id: denuncia.TipoDenuncia.id,
                nombre: denuncia.TipoDenuncia.nombre,
            },
            subtipoDenuncia: {
                id: denuncia.SubtipoDenuncia.id,
                nombre: denuncia.SubtipoDenuncia.nombre,
            },
            pruebas: pruebasUrls,
            audio: audioUrl,
            tieneEvidencia: denuncia.tieneEvidencia,
            fechaCreacion: denuncia.createdAt,
            fechaActualizacion: denuncia.updatedAt,
        },
    });
};

/**
 * Envía una respuesta de error cuando no se encuentra la denuncia.
 * @param res - Objeto de respuesta Express.
 */
const handleDenunciaNotFound = (res: Response) => {
    res.status(404).json({
        success: false,
        message: errorMessages.denunciaNotFound,
        error: 'No se encontró ninguna denuncia con la clave proporcionada',
    });
};

/**
 * Controlador principal para consultar una denuncia anónima.
 * Recibe la clave única como parámetro de consulta y retorna la denuncia con sus relaciones.
 * 
 * Ejemplo de uso:
 * GET /consultas?claveUnica=ABC123
 * 
 * @param req - Objeto de petición Express.
 * @param res - Objeto de respuesta Express.
 */
export const consultarDenunciaAnonima = async (req: Request, res: Response) => {
    try {
        // Se obtiene la clave única desde req.query.
        const { claveUnica } = req.query as { claveUnica: string };

        // Validar la entrada de datos (claveUnica)
        const inputValidationErrors = validateClaveUnica(claveUnica);

        // Manejar cualquier error de validación y detener la ejecución si es necesario.
        if (handleInputValidationErrors(inputValidationErrors, res)) {
            return;
        }

        // Buscar la denuncia en la base de datos junto con sus relaciones.
        const denuncia = await findDenunciaWithRelations(claveUnica);

        // Si no se encuentra la denuncia, se retorna error 404.
        if (!denuncia) {
            return handleDenunciaNotFound(res);
        }

        // Enviar respuesta exitosa con la información formateada.
        handleSuccessResponse(res, denuncia);

    } catch (error) {
        // En caso de error, se maneja y se envía la respuesta del servidor.
        handleServerError(error, res);
    }
};

/**
 * Maneja los errores del servidor, registrándolos y enviando una respuesta 500.
 * @param error - Error capturado.
 * @param res - Objeto de respuesta Express.
 */
export const handleServerError = (error: any, res: Response) => {
    console.error("Error en el controlador de consulta denuncia anónima:", error);
    res.status(500).json({
        message: errorMessages.serverError,
        error: error.message,
    });
};
