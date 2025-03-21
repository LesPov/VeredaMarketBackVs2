import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorMessages } from '../errors/errorMessages';

export interface CustomRequest extends Request {
  user?: { userId: number; rol: string } | null;
}

const extractBearerToken = (headerToken: string | undefined): string | null => {
  if (headerToken && headerToken.startsWith('Bearer ')) {
    return headerToken.slice(7);
  }
  return null;
};

const verifyToken = (token: string): any => {
  // Utiliza la clave secreta de las variables de entorno o un valor por defecto
  return jwt.verify(token, process.env.SECRET_KEY || 'pepito123');
};

const handleAuthError = (res: Response, message: string) => {
  res.status(401).json({ msg: message });
};

const validateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const headerToken = req.headers['authorization'];
  const bearerToken = extractBearerToken(headerToken);

  // Si no se envía token, lo permitimos (acceso anónimo)
  if (!bearerToken) {
    req.user = null;
    return next();
  }

  try {
    const decodedToken = verifyToken(bearerToken);
    req.user = { userId: decodedToken.userId || decodedToken.id, rol: decodedToken.rol };
    next();
  } catch (error) {
    // Si el token enviado es inválido, se retorna error 401
    handleAuthError(res, errorMessages.invalidToken);
  }
};

export default validateToken;
