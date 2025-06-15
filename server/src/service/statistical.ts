import { sql } from "kysely"
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/mysql"
import { db } from "models/connect"

export default class StatisticalStatement {
    public product = async () => {
        return await db.selectFrom("products")
            .select((eb: any) => [
                eb.fn.count("idProduct").as("total"),
                jsonArrayFrom(
                    eb.selectFrom("products as p")
                        .select([
                            "p.nameProduct", "p.price", "p.imgProduct", "p.view"
                        ])
                        .orderBy("p.view", "desc")
                        .limit(4)
                ).as("view"),
                jsonArrayFrom(
                    eb.selectFrom("order_detail as od")
                        .select([
                            "od.idOrdDetail", "od.idProduct", "p.nameProduct", "p.price", "p.imgProduct",
                            eb.fn.sum("od.countProduct").as("sold")
                        ])
                        .innerJoin("products as p", "p.idProduct", "od.idProduct")
                        .leftJoin("order as o", "o.idOrder", "od.idOrder")
                        .where("o.orderStatus", "=", "success")
                        .groupBy("od.idProduct")
                        .orderBy("sold", "desc")
                        .limit(4)
                ).as("sold"),
                jsonArrayFrom(
                    eb.selectFrom("order_detail as od")
                        .select([
                            "od.idOrdDetail", "od.idProduct", "p.nameProduct", "p.price", "p.imgProduct",
                            eb.fn.sum("od.countProduct").as("sold")
                        ])
                        .innerJoin("products as p", "p.idProduct", "od.idProduct")
                        .leftJoin("order as o", "o.idOrder", "od.idOrder")
                        .where("o.orderStatus", "=", "success")
                        .groupBy("od.idProduct")
                        .orderBy("sold", "asc")
                        .limit(4)
                ).as("order")
            ])
            .execute()
    }

    public user = async () => {
        return await db.selectFrom("users")
            .select((eb: any) => [
                eb.fn.count("idUser").as("total_user"),
                jsonObjectFrom(eb.selectFrom("users")
                    .select((ud: any) => [ud.fn.count("idUser").as("count"), sql<string>`DATE_FORMAT(CURDATE(), '%Y-%m')`.as("month")])
                    .where(sql<string>`DATE_FORMAT(created_at, '%Y-%m')`, "like", sql<string>`DATE_FORMAT(CURDATE(), '%Y-%m')`)
                ).as("current_month"),
                jsonObjectFrom(
                    eb.selectFrom("users")
                        .select((ud: any) => [ud.fn.count("idUser").as("count"), sql<string>`DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL 1 MONTH), '%Y-%m')`.as("month")])
                        .where(sql<string>`DATE_FORMAT(created_at, '%Y-%m')`, "like", sql<string>`DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL 1 MONTH), '%Y-%m')`)
                ).as("last_month")
            ])
            .execute()
    }
    public order = async () => {
        const result =  await db.selectFrom("order")
            .select((eb:any) => [
              "idOrder", "u.nameUser","u.email","orderStatus", "paymentStatus","order.created_at","method",
              jsonArrayFrom(
                eb.selectFrom("order_detail as od")
                .select(["p.price","od.countProduct"])
                .innerJoin("products as p", "p.idProduct", "od.idProduct")
                .whereRef("od.idOrder","=", "order.idOrder")
              ).as("detail")

            ])
            .leftJoin("users as u", "u.idUser", "order.idUser")
            .orderBy("order.created_at", "desc") 
            .limit(5)
            .execute()
        
        return result.map((e:any) => ({
            idOrder: e.idOrder,
            nameUser: e.nameUser,
            email: e.email,
            orderStatus: e.orderStatus,
            paymentStatus: e.paymentStatus,
            method: e.method,
            total: e.detail.reduce((acc: number, item: any) => acc + item.price * item.countProduct, 0),
            count: e.detail.reduce((acc: number, item: any) => acc + item.countProduct, 0),
            created_at: new Date(e.created_at).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }),
        }))
    }
    public countOrder = async () => {
        return await db.selectFrom("order")
            .select((eb: any) => [
                eb.fn.count("idOrder").as("total")
                /* , eb
                    .selectFrom("order")
                    .select((eb: any) => eb.fn.count("idOrder").as("new"))
                    .where("created_at", ">", sql<string>`DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL 1 MONTH), '%Y-%m')`)
                    .as("new") */
                , eb
                    .selectFrom("order")
                    .select((eb: any) => eb.fn.count("idOrder").as("pending"))
                    .where("orderStatus", "=", "pending")
                    .as("pending")
                , eb
                    .selectFrom("order")
                    .select((eb: any) => eb.fn.count("idOrder").as("delivery"))
                    .where("orderStatus", "=", "delivery")
                    .as("delivery")
                , eb
                    .selectFrom("order")
                    .select((eb: any) => eb.fn.count("idOrder").as("shipping"))
                    .where("orderStatus", "=", "shipping")
                    .as("shipping")
                , eb
                    .selectFrom("order")
                    .select((eb: any) => eb.fn.count("idOrder").as("success"))
                    .where("orderStatus", "=", "success")
                    .as("success")
            ])
            .execute()
    }
    public commentPost = async () => {
        return await db.selectFrom("comment_post")
            .select<any>(["id", "u.idUser", "u.nameUser", "commentValue", "created_date"])
            .leftJoin("users as u", "u.idUser", "comment_post.idUser")
            .orderBy("created_date", "desc")
            .orderBy("id", "desc")
            .limit(5)
            .execute()
    }
    public commentProduct = async () => {
        return await db.selectFrom("comments")
            .select<any>(["idComment as id", "u.idUser", "u.nameUser", "commentValue", "dateComment as created_date"])
            .leftJoin("users as u", "u.idUser", "comments.idUser")
            .orderBy("dateComment", "desc")
            .orderBy("idComment", "desc")
            .limit(5)
            .execute()
    }
    public productAnalyze = async () => {
        return await db.selectFrom("products")
            .select<any>((eb:any) =>[
                eb.fn.count("idProduct").as("total"),
                jsonObjectFrom(eb.selectFrom("products")
                .select((eb: any) => eb.fn.count("idProduct").as("new"))
                .where(sql<string>`DATE_FORMAT(created_at, '%Y-%m')`, "like", sql<string>`DATE_FORMAT(CURDATE(), '%Y-%m')`)
                ).as("new"),
                jsonObjectFrom(eb.selectFrom("products")
                .select((eb: any) => eb.fn.count("idProduct").as("last"))
                .where(sql<string>`DATE_FORMAT(created_at, '%Y-%m')`, "like", sql<string>`DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL 1 MONTH), '%Y-%m')`)
                ).as("last"),
                jsonArrayFrom(
                    eb.selectFrom("order_detail as od")
                    .select(["od.idOrdDetail", "od.idProduct", "p.nameProduct", "p.price", "p.imgProduct",sql<number>`SUM(od.countProduct)`.as("sold")])
                    .innerJoin("products as p", "p.idProduct", "od.idProduct")
                    .groupBy("od.idProduct")
                    .orderBy("sold", "desc")
                    .orderBy("od.idProduct", "asc")
                    .limit(5)
                ).as("order")
            ])
            .execute()
    }
    public orderAnalyze = async () => {
        const query =  await db.selectFrom("order")
        .select<any>((eb:any) =>[
            eb.fn.count("idOrder").as("total"),
            jsonObjectFrom(eb.selectFrom("order_detail")
                .select(sql<number>`SUM(countProduct)`.as("total"))
            ).as("sold"),
            jsonObjectFrom(eb.selectFrom("order")
            .select((eb: any) => eb.fn.count("idOrder").as("new"))
            .where(sql<string>`DATE_FORMAT(created_at, '%Y-%m')`, "like", sql<string>`DATE_FORMAT(CURDATE(), '%Y-%m')`)
            ).as("new"),
            jsonObjectFrom(eb.selectFrom("order")
            .select((eb: any) => eb.fn.count("idOrder").as("last"))
            .where(sql<string>`DATE_FORMAT(created_at, '%Y-%m')`, "like", sql<string>`DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL 1 MONTH), '%Y-%m')`)
            ).as("last"),
            jsonArrayFrom(
                eb.selectFrom("order_detail as od")
                .select([
                    sql<number>`SUM(od.countProduct)`.as("total"),
                    "t.nameType"
                ])
                .leftJoin("products as p", "p.idProduct", "od.idProduct")
                .leftJoin("type as t","t.idType","p.idType")
                .groupBy("t.idType")
            ).as("type")
            
        ])
        .execute() 
        return query.map((e:any) => ({
            ...e,
            sold:e.sold.total,
            new:e.new.new,
            last:e.last.last
        }))
    }

    public revenue = async () => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
      
        const months: string[] = [];
        for (let i = 1; i <= 12; i++) {
          const paddedMonth = i.toString().padStart(2, "0");
          months.push(`${currentYear}-${paddedMonth}`);
        }
        const total = await db.selectFrom("order as o")
          .innerJoin("order_detail as od", "od.idOrder", "o.idOrder")
          .innerJoin("products as p", "p.idProduct", "od.idProduct")
          .select(sql<number>`SUM(od.countProduct * p.price)`.as("total"))
          .where("o.orderStatus", "=", "success")
          .execute();
        const data = await db.selectFrom("order as o")
          .innerJoin("order_detail as od", "od.idOrder", "o.idOrder")
          .innerJoin("products as p", "p.idProduct", "od.idProduct")
          .select([
            sql<string>`DATE_FORMAT(o.created_at, '%Y-%m')`.as("month"),
            sql<number>`SUM(od.countProduct * p.price)`.as("monthlyTotal"),
          ])
          .where("o.orderStatus", "=", "success")
          .where(sql`YEAR(o.created_at)`, "=", currentYear)
          .where(sql`MONTH(o.created_at)`, "<=", currentMonth)
          .groupBy(sql`DATE_FORMAT(o.created_at, '%Y-%m')`)
          .orderBy(sql`DATE_FORMAT(o.created_at, '%Y-%m')`)
          .execute();
        const result = {
            revenue: total[0].total,
            year: currentYear,
            detail:months.map((month) => {
                const found = data.find((d) => d.month === month);
                return {
                    month:month.split("-")[1],
                    monthlyTotal: found?.monthlyTotal ?? 0,
                };
              }).reverse()
        }
      
        return result;
      };
      
      
}
