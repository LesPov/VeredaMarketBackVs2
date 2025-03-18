import { Model } from "sequelize";

export interface FarmProfileInterface extends Model {
    id?: number;
    userId: number;
    address: string;
    vereda: string;
    municipality: string;
    department: string;
    gpsCoordinates?: string;
    landType: 'Propio' | 'Arriendo' | 'Sana Posesión' | 'Ocupación' | 'Anticresis' | 'Usufructo';
    housingLocation: 'Dentro del predio'
    | 'Predio colindante'
    | 'Predio no colindante (misma vereda)'
    | 'Predio no colindante (otra vereda)'
    | 'Predio no colindante (otro municipio)'
    | 'Otra';
    totalArea: number;
    areaPecuaria?: number;
    areaAgricola?: number;
    areaForestal?: number;
    areaReservaNatural?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
