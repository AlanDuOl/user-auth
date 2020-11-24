import * as Yup from 'yup';
import { RegisterUser } from '../viewmodels';

const validationService = {
    async validateRegisterDataAsync(data: RegisterUser): Promise<void> {
        // define structure of object to be validated
        const schema = Yup.object().shape({
            name: Yup.string().required().max(100),
            email: Yup.string().email().required().max(100),
            password: Yup.string().required().max(8).min(6)
                .matches(/\d+/).matches(/[A-Z]+/).matches(/[a-z]+/).matches(/\W+/),
            confirmPassword: Yup.string().required().max(8).min(6)
                .matches(/\d+/).matches(/[A-Z]+/).matches(/[a-z]+/).matches(/\W+/),
        });
        
        // validate form data
        await schema.validate(data, { abortEarly: false });
    }
}

export default validationService;