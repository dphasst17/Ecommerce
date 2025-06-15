import { db } from "models/connect";
export default class AuthStatement {
    public getAuth = async (username: string) => {
        return await db.selectFrom('auth')
            .select(["idUser", "username", "password_hash", "role"])
            .where('username', '=', `${username}`)
            .where('action', '!=', 'block')
            .execute()
    }
    public getAuthAdmin = async (username: string) => {
        return await db.selectFrom('auth')
            .select<any>(["idUser", "username", "password_hash", "role", "position.position_name"])
            .leftJoin("position", "position.idStaff", "auth.idUser")
            .where('username', '=', `${username}`)
            .where('role', '!=', 2)
            .where('action', '!=', 'block')
            .execute()
    }
    public getMail = async (email: string) => {
        return await db.selectFrom('users')
            .select(["idUser", "email"])
            .where('email', '=', email)
            .execute()
    }
    public getPassword = async (idUser: string) => {
        return await db.selectFrom('auth')
            .select(["idUser", "password_hash"])
            .where("idUser", "=", `${idUser}`)
            .execute()
    }
}