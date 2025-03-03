import { errorMessages } from '../../../../middleware/errors/errorMessages';

export const validateInputrRequestPassword= (usernameOrEmail: string): string[] => {
    const errors: string[] = [];
    if (!usernameOrEmail) {
        errors.push(errorMessages.requiredFields);
    }
    return errors;
};
