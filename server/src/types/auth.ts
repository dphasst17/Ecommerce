export interface AuthDB {
    idUser: string,
    username: string,
    password_hash: string,
    rfToken: string,
    role: number,
    status: string
    action: string
}
export interface Auth {
    username: string,
    password?: string,
    email?: string
}
export interface AuthResponse {
    accessToken: string,
    expAccess: number,
    refreshToken?: string,
    expRefresh?: number
}
