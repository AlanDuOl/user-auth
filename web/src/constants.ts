
const baseApiPath = 'http://localhost:2000';

export const apiPath = {
    login: `${baseApiPath}/login`,
    register: `${baseApiPath}/register`,
    get: baseApiPath,
}

export const uiPath = {
    home: '/',
    login: '/login'
}

export const logoutStatus = {
    success: 'Logout complete',
    failure: 'Logout failed',
}

export const validationMessage = {
    required: "Field required",
    email: "Not a valid email",
    pattern: "Not a valid number",
    maxlength: "Limit of characters exceeded"
}