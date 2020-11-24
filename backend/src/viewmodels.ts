import Role from './models/role';

export interface UserData {
    name: string,
    email: string,
    passwordHash: string,
    roles: Role[],
    isVerified: boolean
}

export interface RegisterUser {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}

export interface LoginUser {
    email: string,
    password: string,
}

export interface PayloadUser {
    id: number,
    name: string,
    roles: string[]
}