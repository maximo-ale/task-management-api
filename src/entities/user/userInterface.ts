export interface RegisterUser{
    name: string,
    email: string,
    password: string,
}

export interface ProtectedUserInfo{
    id: string,
    name: string,
}

export interface LoginInfo{
    id: string,
    password: string,
}

export interface LoginUser{
    name?: string,
    email?: string,
    password: string,
}