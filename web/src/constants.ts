
const baseApiPath = 'http://localhost:2000';

export const apiPath = {
    login: `${baseApiPath}/login`,
    register: `${baseApiPath}/register`,
    verify: `${baseApiPath}/verify`,
    sendemail: `${baseApiPath}/sendemail`,
    requestCode: `${baseApiPath}/requestcode`,
    get: baseApiPath,
}

export const uiPath = {
    home: '',
    login: 'login',
    logout: 'logout',
    verify: 'verify',
    register: 'register',
    requestCode: 'requestcode',
    sendCode: 'sendcode',
    resetPassword: 'resetpassword'
}

export const logoutStatus = {
    success: 'Logout complete',
    failure: 'Logout failed',
}

export const validationMessage = {
    required: 'Field required',
    email: 'Not a valid email',
    maxlength: 'Limit of characters exceeded',
    minlength: 'Minimun of 6 characters',
    containdigit: 'Must contain a number',
    containuppercase: 'Must contain an uppercase letter',
    containlowercase: 'Must contain a lowercase letter',
    notword: 'Must contain a not word character',
}