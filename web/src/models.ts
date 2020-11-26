

export interface User {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}

export interface LoginUser {
    email: string,
    password: string,
}

export interface AuthUser {
    id: number,
    name: string,
    token: string,
    exp: number,
    roles: string[]
}

export interface ResponseFeedback {
    message: string,
    id?: number,
    type: FeedBackType,
}

export enum FeedBackType {
    error,
    success,
    warning
}