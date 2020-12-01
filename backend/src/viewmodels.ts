import Role from './models/role';

export interface NewUser {
    name: string,
    email: string,
    passwordHash: string,
    roles: Role[],
    isVerified: boolean,
    createdAt: Date,
    updatedAt: Date,
    resetPasswordDate: Date
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

export interface ResetData {
    password: string,
    confirmPassword: string,
    token: string
}