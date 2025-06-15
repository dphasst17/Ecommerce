import { jsonArrayFrom } from "kysely/helpers/mysql"
import { db } from "models/connect"

export default class PostStatement {

    public createPost = async (data: any) => {
        return await db
            .insertInto("posts")
            .values({
                dateAdded: data.dateAdded,
                idType: data.idType,
                title: data.title,
                thumbnails: data.thumbnails,
                valuesPosts: `${data.valuesPosts}`,
                poster: data.poster
            })
            .executeTakeFirst()
    }
    /*     public getAll = async () => {
            return await db.selectFrom("posts as p")
                .select(["idPost", "p.idType", "t.nameType", "dateAdded", "p.title", "p.thumbnails", "valuesPosts", "poster"])
                .innerJoin("typePost as t", "p.idType", "t.idType")
                .orderBy("dateAdded desc")
                .execute()
        } */
    public getAll = async () => {
        return await db.selectFrom("posts as p")
            .select(["idPost", "p.idType", "t.nameType", "dateAdded", "p.title", "p.thumbnails", "poster"])
            .innerJoin("type_post as t", "p.idType", "t.idType")
            .orderBy("dateAdded desc")
            .execute()
    }
    public getCategory = async () => {
        return await db.selectFrom("type_post")
            .selectAll()
            .execute()
    }
    public getDetail = async (id: number) => {
        return await db.selectFrom("posts as p")
            .innerJoin("type_post as t", "p.idType", "t.idType")
            .select(["idPost", "p.idType", "t.nameType", "dateAdded", "p.title", "p.thumbnails", "valuesPosts", "poster"])
            .where("idPost", "=", id)
            .execute()
    }
}