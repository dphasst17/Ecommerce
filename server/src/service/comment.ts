import { db } from "models/connect"

export default class CommentStatement {
    public getAllCommentProduct = async () => {
        return await db.selectFrom("comments")
            .select<any>([
                "comments.idComment as id", "comments.idUser", "comments.commentValue as value", "comments.dateComment as created_date",
                "u.nameUser", "u.img", "p.nameProduct as name"
            ])
            .leftJoin("products as p", "p.idProduct", "comments.idProduct")
            .leftJoin("users as u", "u.idUser", "comments.idUser")
            .orderBy("comments.dateComment desc")
            .orderBy("comments.idComment desc")
            .execute()
    }
    public getAllCommentPost = async () => {
        return await db.selectFrom("comment_post")
            .select(["comment_post.id", "comment_post.idUser", "comment_post.commentValue as value", "comment_post.created_date", "u.nameUser", "u.img", "p.title as name"])
            .leftJoin("posts as p", "p.idPost", "comment_post.idPost")
            .leftJoin("users as u", "u.idUser", "comment_post.idUser")
            .orderBy("comment_post.created_date desc")
            .orderBy("comment_post.id desc")
            .execute()
    }
    public getCountComment = async (id: number, table: "comments" | "commentPost") => {
        return await db.selectFrom(table)
            .select((eb: any) => eb.fn.count(table === "comments" ? "idComment" : "id").as("total"))
            .where(table === "comments" ? "comments.idProduct" : "comment_post.idPost", "=", id)
            .execute()
    }
    public getByProduct = async (id: number, page?: number) => {
        const pageSize = 4
        const offset = ((page ? page : 1) * pageSize) - pageSize

        return await db.selectFrom("comments")
            .select<any>([
                "comments.idComment",
                "comments.idProduct",
                "comments.commentValue",
                "comments.dateComment",
                "u.nameUser",
                "u.img"
            ])
            .where("comments.idProduct", "=", id)
            .leftJoin("users as u", "u.idUser", "comments.idUser")
            .orderBy("comments.dateComment", "desc")
            .orderBy("comments.idComment", "desc")
            .limit(pageSize)
            .offset(offset)
            .execute()
    }
    public getByPost = async (id: number, page?: number) => {
        const pageSize = 4
        const offset = ((page ? page : 1) * pageSize) - pageSize
        return await db.selectFrom("comment_post as cp")
            .select<any>([
                "cp.id",
                "cp.idPost",
                "cp.commentValue",
                "cp.created_date",
                "u.nameUser",
                "u.img"
            ])
            .where("cp.idPost", "=", id)
            .leftJoin("users as u", "u.idUser", "cp.idUser")
            .orderBy("cp.created_date", "desc")
            .orderBy("cp.id", "desc")
            .limit(pageSize)
            .offset(offset)
            .execute()
    }
}