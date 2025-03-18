import { DataTypes } from 'sequelize';
import sequelize from '../../../../../database/connection';
import { TechnologyPracticeInterface } from '../interfaces/technologyPractice.interface';

/**
 * Modelo que representa la información de Tecnología y Prácticas Productivas.
 * Cada registro se asocia a un usuario (a través de userId) y contiene datos sobre
 * la preparación o conservación de terrenos, equipos e implementos disponibles,
 * métodos de control de plagas, capacitación en biopreparados y detalles sobre
 * la multiplicación de material en la finca.
 */
export const TechnologyPracticeModel = sequelize.define<TechnologyPracticeInterface>('TechnologyPracticeModel', {
    /**
     * Identificador único del registro.
     */
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    /**
     * ID del usuario al que pertenece esta información.
     * Se establece como único para garantizar que cada usuario tenga un solo registro.
     * Hace referencia al modelo 'auth'.
     */
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'auth', // Debe coincidir con el nombre de la tabla/modelo de autenticación.
            key: 'id',
        },
    },
    /**
     * Método utilizado para la preparación o conservación de terrenos.
     * Valor permitido: 'Maquinaria', 'Arado de tracción animal' o 'Arado manual'.
     */
    preparationMethod: {
        type: DataTypes.ENUM('Maquinaria', 'Arado de tracción animal', 'Arado manual'),
        allowNull: false,
    },
    // Equipos e implementos disponibles en la finca:
    /**
     * Indica si se cuenta con una fumigadora manual.
     */
    hasManualFumigadora: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    /**
     * Indica si se cuenta con una fumigadora a motor.
     */
    hasMotorFumigadora: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    /**
     * Indica si se cuenta con equipo de ordeño.
     */
    hasMilkingEquipment: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    /**
     * Indica si se cuenta con una guadaña.
     */
    hasGuadana: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    /**
     * Indica si se cuentan con herramientas manuales.
     */
    hasManualTools: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    /**
     * Indica si se cuenta con una planta eléctrica.
     */
    hasElectricPlant: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    /**
     * Indica si se cuenta con un tractor.
     */
    hasTractor: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    /**
     * Indica si se cuenta con un motocultor.
     */
    hasMotocultor: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    /**
     * Indica si se cuenta con una picadora.
     */
    hasPicadora: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    /**
     * Indica si se cuenta con tanques de frío.
     */
    hasColdTanks: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    /**
     * Indica si se cuenta con una motobomba.
     */
    hasMotobomba: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    /**
     * Campo opcional para especificar otros implementos disponibles.
     */
    otherEquipment: { type: DataTypes.STRING, allowNull: true },
    /**
     * Método utilizado para el control de plagas, arvenses y enfermedades.
     * Valor permitido: 'Síntesis química (calendario)', 'Síntesis química y biológicos',
     * 'Plaguicidas biológicos' o 'Productos orgánicos'.
     */
    pestControlMethod: {
        type: DataTypes.ENUM(
            'Síntesis química (calendario)',
            'Síntesis química y biológicos',
            'Plaguicidas biológicos',
            'Productos orgánicos'
        ),
        allowNull: false,
    },
    // Capacitación en uso y elaboración de biopreparados:
    /**
     * Indica si el usuario ha recibido capacitación en uso y elaboración de biopreparados.
     */
    receivedTrainingForBiopreparados: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    /**
     * Indica si el usuario está interesado en recibir capacitaciones.
     */
    interestedInTraining: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    /**
     * Frecuencia de uso de biopreparados para el control de plagas (opcional).
     * Ejemplo: 'semanal', 'mensual'.
     */
    biopreparadosPestFrequency: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Frecuencia de uso para control de plagas (ej. semanal, mensual)',
    },
    /**
     * Frecuencia de uso de biopreparados para fertilización (opcional).
     */
    biopreparadosFertilizationFrequency: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Frecuencia de uso para fertilización',
    },
    // Multiplicación de material:
    /**
     * Indica si se realiza la multiplicación de material (insumos, semillas, animales).
     */
    performsMultiplication: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    /**
     * Detalle opcional del porcentaje y frecuencia de multiplicación.
     */
    multiplicationDetail: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Detalle del porcentaje y frecuencia de multiplicación',
    },
}, {
    tableName: 'technologyPractice', // Nombre de la tabla en la base de datos
    timestamps: true, // Agrega automáticamente los campos createdAt y updatedAt
});

export default TechnologyPracticeModel;
