import { sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/mysql";
import { db } from "models/connect";

export default class UserStatement {
  public getUser = async (idUser: string) => {
    return await db
      .selectFrom("users")
      .select<any>((eb: any) => [
        "idUser",
        "nameUser",
        "phone",
        "email",
        jsonArrayFrom(
          eb.selectFrom("carts")
            .select((c: any) => [
              "idCart",
              "carts.idProduct",
              "countProduct",
              jsonArrayFrom(
                c
                  .selectFrom("products as p")
                  .select([
                    "nameProduct",
                    "imgProduct",
                    "price",
                    sql`IF(sale.end_date >= CURDATE() AND sale.start_date <= CURDATE(), IFNULL(sd.discount, 0), 0)`.as(
                      "discount"
                    ),
                  ])
                  .leftJoin("sale_detail as sd", "p.idProduct", "sd.idProduct")
                  .leftJoin("sale", "sd.idSale", "sale.idSale")
                  .whereRef("carts.idProduct", "=", "p.idProduct")
                  .where("p.status", "=", "show")
              ).as("detail"),
            ])
            .leftJoin("products", "carts.idProduct", "products.idProduct")
            .where("carts.idUser", "=", idUser)
            .where("products.status", "=", "show")
        ).as("cart"),
        jsonArrayFrom(
          eb
            .selectFrom("user_address as ua")
            .select(["ua.idAddress", "ua.typeAddress as type", "ua.detail"])
            .whereRef("ua.idUser", "=", "users.idUser")
        ).as("address"),
      ])
      .where("users.idUser", "=", `${idUser}`)
      .execute();
  };

  public adminGetInfo = async (idStaff: string) => {
    return await db
      .selectFrom("staff")
      .select<any>(["staff.idStaff", "name", "phone", "email", "birthday", "address", "avatar", "created_at", "updated_at", "position.position_name"])
      .leftJoin("position", "staff.idStaff", "position.idStaff")
      .where("staff.idStaff", "=", idStaff)
      .execute();
  }
  public getAllUser = async () => {
    return await db
      .selectFrom("users")
      .select<any>(["users.idUser", "nameUser", "phone", "email", "created_at", "updated_at", "auth.action"])
      .leftJoin("auth", "users.idUser", "auth.idUser")
      .where("auth.role", "=", 2)
      .execute();
  }
  public getAllStaff = async () => {
    return await db
      .selectFrom("staff")
      .select<any>([
        "staff.idStaff",
        "name",
        "phone",
        "email",
        "birthday",
        "address",
        "avatar",
        "created_at",
        "updated_at",
        "position.position_name",
        "position.position_id",
        "auth.action"
      ])
      .leftJoin("auth", "staff.idStaff", "auth.idUser")
      .leftJoin("position", "staff.idStaff", "position.idStaff")
      .where("auth.role", "=", 1)
      .execute();
  }
  public getShipper = async () => {
    return await db
      .selectFrom("position")
      .select<any>(["position.idStaff", "position_name", "staff.name"])
      .leftJoin("staff", "position.idStaff", "staff.idStaff")
      .where("position.position_name", "=", "shipper")
      .execute()
  }
  public getAllAddress = async () => {
    return await db
      .selectFrom("user_address")
      .select<any>([
        "user_address.idAddress", "user_address.idUser", "user_address.typeAddress", "user_address.detail", "users.nameUser"
      ])
      .leftJoin("users", "user_address.idUser", "users.idUser")
      .execute();
  }
}
