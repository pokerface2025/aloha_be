export class AppError extends Error {
    statusCode: number;
    error?: boolean = true;

    constructor(message: string | AppError | alertList, statusCode?: number, stack?: string) {
        super(typeof message === 'string' ? message : message.message);
        console.log("🚨 AppError:");
        console.log(message)

        if (typeof message === "string") {
            this.statusCode = statusCode ?? 500;
        } else {
            this.statusCode = message.statusCode!;
        }
    }
}

export class alertList {
    public static readonly userExist: AppError = {
        message: "El usuario ya existe",
        statusCode: 400,
        name: "UserExistError"
    };
    public static readonly userOrEmailExist: AppError = {
        message: "El usuario o el correo ya existe",
        statusCode: 400,
        name: "UserOrEmailExistError"
    };

    public static readonly passwordIsEmpty: AppError = {
        message: "La contraseña es requerida",
        statusCode: 400,
        name: "PasswordIsEmptyError"
    };

    public static readonly emailIsEmpty: AppError = {
        message: "El correo es requerido",
        statusCode: 400,
        name: "EmailIsEmptyError"
    };

    public static readonly usernameIsEmpty: AppError = {
        message: "El nombre de usuario es requerido",
        statusCode: 400,
        name: "UsernameIsEmptyError"
    };

    public static readonly emailIsInvalid: AppError = {
        message: "El correo es inválido",
        statusCode: 400,
        name: "EmailIsInvalidError"
    };

    public static readonly userNotFound: AppError = {
        message: "Usuario no encontrado",
        statusCode: 404,
        name: "UserNotFoundError"
    };

    public static readonly passwordIsIncorrect: AppError = {
        message: "La contraseña es incorrecta",
        statusCode: 401,
        name: "PasswordIsIncorrectError"
    };

    public static readonly userIsNotAllowed: AppError = {
        message: "El usuario no está permitido",
        statusCode: 403,
        name: "UserIsNotAllowedError"
    };

    public static readonly userIsNotAuthorized: AppError = {
        message: "El usuario no está autorizado",
        statusCode: 403,
        name: "UserIsNotAuthorizedError"
    };

    public static readonly userIsNotAuthenticated: AppError = {
        message: "El usuario no está autenticado",
        statusCode: 401,
        name: "UserIsNotAuthenticatedError"
    };

    public static readonly tokenIsInvalid: AppError = {
        message: "El token es inválido",
        statusCode: 401,
        name: "TokenIsInvalidError"
    };

    public static readonly tokenIsExpired: AppError = {
        message: "El token ha expirado",
        statusCode: 401,
        name: "TokenIsExpiredError"
    };

    message: string | undefined;
    statusCode: number | undefined;

    static readonly tokenIsMissing: AppError = {
        message: "El token está faltando",
        statusCode: 401,
        name: "TokenIsMissingError"
    };
    static readonly mobilePhoneIsInvalid: AppError = {
        message: "El teléfono móvil es inválido",
        statusCode: 400,
        name: "MobilePhoneIsInvalidError"
    };
    static readonly customerNotFound: AppError = {
        message: "Cliente no encontrado",
        statusCode: 404,
        name: "CustomerNotFoundError"
    };
    static readonly customerAlreadyExists: AppError = {
        message: "El cliente ya existe",
        statusCode: 400,
        name: "CustomerAlreadyExistsError"
    };
    static readonly customerTypeIsInvalid: string | alertList | AppError = {
        message: "El tipo de cliente es inválido",
        statusCode: 400,
        name: "CustomerTypeIsInvalidError"
    };
    static readonly customerDocumentTypeIsInvalid: string | alertList | AppError = {
        message: "El tipo de documento del cliente es inválido",
        statusCode: 400,
        name: "CustomerDocumentTypeIsInvalidError"
    };
    static readonly ResidenceTypeEnumIsInvalid: AppError = {
        message: "El tipo de residencia es inválido",
        statusCode: 400,
        name: "ResidenceTypeEnumIsInvalidError"
    };
    static idIsRequired: string | alertList | AppError = {
        message: "El _id es requerido",
        statusCode: 400,
        name: "IdIsRequiredError"
    };
    static idBadFormat: string | AppError | alertList = {
        message: "El _id tiene un formato incorrecto",
        statusCode: 400,
        name: "IdBadFormatError"
    };
    static tokenSignatureIsInvalid: string | alertList | AppError = {
        message: "La firma del token es inválida",
        statusCode: 401,
        name: "TokenSignatureIsInvalidError"
    };
    static planNotFound: string | alertList | AppError = {
        message: "Plan no encontrado",
        statusCode: 404,
        name: "PlanNotFoundError"
    };
    static serviceTypeEnumIsInvalid: AppError = {
        message: "El tipo de servicio es inválido",
        statusCode: 400,
        name: "ServiceTypeEnumIsInvalidError"
    };
    static estratoNotValid: string | alertList | AppError = {
        message: "El plan no es válido para el estrato seleccionado",
        statusCode: 400,
        name: "EstratoNotValidError"
    };
    static estratoRequired: string | alertList | AppError = {
        message: "El estrato es requerido",
        statusCode: 400,
        name: "EstratoRequiredError"
    };
    static priceRequired: string | alertList | AppError = {
        message: "El precio es requerido",
        statusCode: 400,
        name: "PriceRequiredError"
    };
    static taxRequired: string | alertList | AppError = {
        message: "El impuesto es requerido",
        statusCode: 400,
        name: "TaxRequiredError"
    };
    static periodRequired: string | alertList | AppError = {
        message: "El período es requerido",
        statusCode: 400,
        name: "PeriodRequiredError"
    };
    static descriptionRequired: string | alertList | AppError = {
        message: "La descripción es requerida",
        statusCode: 400,
        name: "DescriptionRequiredError"
    };
    static installationPaymentIdNotFound: string | alertList | AppError = {
        message: "Id de pago de instalación no encontrado",
        statusCode: 404,
        name: "InstallationPaymentIdNotFoundError"
    };
    static installationStateEnumIsInvalid: AppError = {
        message: "El estado de instalación es inválido",
        statusCode: 400,
        name: "InstallationStateEnumIsInvalidError"
    };
    static serviceStateEnumIsInvalid: AppError = {
        message: "El estado del servicio es inválido",
        statusCode: 400,
        name: "ServiceStateEnumIsInvalidError"
    };
    static installationPaymentNotFound: string | alertList | AppError = {
        message: "Pago de instalación no encontrado",
        statusCode: 404,
        name: "InstallationPaymentNotFoundError"
    };
    static serviceNotFound: string | alertList | AppError = {
        message: "Servicio no encontrado",
        statusCode: 404,
        name: "ServiceNotFoundError"
    };
    static usernameOrPasswordIsEmpty: string | alertList | AppError = {
        message: "El nombre de usuario o la contraseña está vacía",
        statusCode: 400,
        name: "UsernameOrPasswordIsEmptyError"
    };

}
