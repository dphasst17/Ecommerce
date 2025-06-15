import { sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/mysql";
import { db } from "models/connect";
export default class ProductStatement {
  public getColumnByType = async (typeName: string) => {
    return await db
      .selectFrom("type_detail")
      .selectAll()
      .where("type", "=", typeName)
      .orderBy("displayorder asc")
      .execute();
  };
  public countData = async () => {
    return await db
      .selectFrom("products")
      .select((eb: any) => eb.fn.count('idProduct').as('total'))
      .execute();
  }
  public findAllType = async () => {
    return await db
      .selectFrom("type")
      .select<any>((eb: any) => [
        "type.idType",
        "type.nameType",
        "type.image_url",
        jsonArrayFrom(
          eb.selectFrom("products")
            .select(eb.fn.count("idProduct").as("count"))
            .whereRef("products.idType", "=", "type.idType")
        ).as("count"),
        jsonArrayFrom(
          eb
            .selectFrom("type_detail as td")
            .select(["id", "type", "name", "datatypes", "displayname", "displayorder"])
            .whereRef("td.type", "=", "type.nameType")
            .orderBy("td.displayorder asc")
        ).as("detail"),
      ])
      .execute();
  };
  public findDetailType = async (nameType: string) => {
    return await db
      .selectFrom("type")
      .select((eb: any) => [
        "type.idType",
        "type.nameType",
        eb.fn.count('p.idProduct').as('count'),
        jsonArrayFrom(
          eb
            .selectFrom("type_detail as td")
            .select(["td.id", "td.type", "td.name", "td.displayname", "td.displayorder", "td.datatypes"])
            .whereRef("td.type", "=", "type.nameType")
        ).as("detail"),
      ])
      .leftJoin("products as p", "p.idType", "type.idType")
      .where("type.nameType", "=", nameType)
      .execute();;
  }
  public findAll = async (limit: number, page: number) => {
    return await db
      .selectFrom("products as p")
      .select<any>([
        "p.idProduct",
        "nameProduct",
        "price",
        "imgProduct",
        "p.idType",
        "brand",
        "t.nameType",
        "p.status as action",
        "view",
        sql`IFNULL(MAX(IF(sale.end_date >= CURRENT_DATE() AND sale.start_date <= CURRENT_DATE(), sd.discount, 0)), 0) AS discount`,
      ])
      .leftJoin("type as t", "p.idType", "t.idType")
      .leftJoin("sale_detail as sd", "p.idProduct", "sd.idProduct")
      .leftJoin("sale", "sd.idSale", "sale.idSale")
      .groupBy("p.idProduct")
      .limit(limit)
      .offset((page - 1) * limit)
      .execute();
  };

  public findByType = async (table: string, shortKey: string, colDetail: string[]) => {
    return await db
      .selectFrom("products as p")
      .select<string | any>((eb: any) => [
        "p.idProduct",
        "nameProduct",
        "price",
        "imgProduct",
        "p.idType",
        "view",
        "brand",
        "t.nameType",
        sql`IF(sale.end_date >= CURDATE() AND sale.start_date <= CURDATE(), IFNULL(sd.discount, 0), 0) AS discount`,
        jsonArrayFrom(
          eb.selectFrom(table).select(colDetail).whereRef(`${table}.idProduct`, "=", "p.idProduct").limit(1)
        ).as("detail"),
      ])
      .leftJoin("type as t", "p.idType", "t.idType")
      .leftJoin("sale_detail as sd", "p.idProduct", "sd.idProduct")
      .leftJoin("sale", "sd.idSale", "sale.idSale")
      .leftJoin(`${table} as ${shortKey}`, "p.idProduct", `${shortKey}.idProduct`)
      .where("t.nameType", "=", table)
      .where("p.status", "=", "show")
      .groupBy("p.idProduct")
      .execute();
  };

  public findDetail = async (idProduct: number, type: string, colDetail: string[]) => {
    return await db
      .selectFrom("products as p")
      .select<any>((eb: any) => [
        "p.idProduct",
        "nameProduct",
        "price",
        "imgProduct",
        "p.des",
        "p.idType",
        "brand",
        "t.nameType",
        "p.view",
        "p.status as action",
        jsonArrayFrom(
          eb.selectFrom("image as i").select(["type", "img"]).whereRef(`i.idProduct`, "=", "p.idProduct")
        ).as("img"),
        jsonArrayFrom(eb.selectFrom(type).select(["id", ...colDetail]).whereRef(`${type}.idProduct`, "=", "p.idProduct")).as(
          "detail"
        ),
        sql`IFNULL(MAX(IF(sale.end_date >= CURRENT_DATE() AND sale.start_date <= CURRENT_DATE(), sd.discount, 0)), 0) AS discount`,
      ])
      .leftJoin("type as t", "p.idType", "t.idType")
      .leftJoin("sale_detail as sd", "p.idProduct", "sd.idProduct")
      .leftJoin("sale", "sd.idSale", "sale.idSale")
      .where("p.idProduct", "=", idProduct)
      .groupBy("p.idProduct")
      .execute();
  };

  public findByCondition = async (condition: "view" | "new") => {
    let orderHandle = "";
    if (condition === "view") {
      orderHandle = "view desc";
    }
    if (condition === "new") {
      orderHandle = "dateAdded desc";
    }
    return await db
      .selectFrom("products as p")
      .select<string | any>([
        "p.idProduct",
        "nameProduct",
        "price",
        "imgProduct",
        "p.idType",
        "brand",
        "t.nameType",
        sql`IF(sale.end_date >= CURDATE() AND sale.start_date <= CURDATE(), IFNULL(sd.discount, 0), 0) AS discount`,
      ])
      .leftJoin("type as t", "p.idType", "t.idType")
      .leftJoin("sale_detail as sd", "p.idProduct", "sd.idProduct")
      .leftJoin("sale", "sd.idSale", "sale.idSale")
      .groupBy("p.idProduct")
      .orderBy(orderHandle)
      .limit(10)
      .execute();
  };

  public findByKey = async (keyword: string) => {
    return await db
      .selectFrom("products as p")
      .select<string | any>([
        "p.idProduct",
        "nameProduct",
        "price",
        "imgProduct",
        "p.idType",
        "brand",
        "t.nameType",
        sql`IF(sale.end_date >= CURDATE() AND sale.start_date <= CURDATE(), IFNULL(sd.discount, 0), 0) AS discount`,
      ])
      .leftJoin("type as t", "p.idType", "t.idType")
      .leftJoin("sale_detail as sd", "p.idProduct", "sd.idProduct")
      .leftJoin("sale", "sd.idSale", "sale.idSale")
      .where((eb: any) =>
        eb("nameProduct", "like", `%${keyword}%`)
          .or("brand", "like", `%${keyword}%`)
          .or("t.nameType", "like", `%${keyword}%`)
      )
      .groupBy("p.idProduct")
      .execute();
  };

  public findAllSaleEvent = async () => {
    return await db.selectFrom("sale").selectAll("sale").execute();
  };
  public findSale = async (date: string) => {
    return await db
      .selectFrom("sale")
      .select<string | any>((eb: any) => [
        "sale.idSale",
        "sale.start_date",
        "sale.end_date",
        "sale.title",
        jsonArrayFrom(
          eb
            .selectFrom("sale_detail as sd")
            .select((s: any) => [
              "sd.id",
              "sd.idProduct",
              "sd.discount",
              "p.nameProduct",
              "p.price",
              "p.imgProduct",
              "type.nameType",
              "p.brand"
            ])
            .leftJoin("products as p", "p.idProduct", "sd.idProduct")
            .leftJoin("type", "p.idType", "type.idType")
            .whereRef("sd.idSale", "=", "sale.idSale")
        ).as("detail"),
      ])
      .where((eb: any) => eb("sale.start_date", "<=", date).and("sale.end_date", ">=", date))
      .execute();
  };
  public findSale_detail = async (idSale: number) => {
    return await db
      .selectFrom("sale")
      .select<string | any>((eb: any) => [
        "sale.idSale",
        "sale.start_date",
        "sale.end_date",
        "sale.title",
        jsonArrayFrom(
          eb
            .selectFrom("sale_detail as sd")
            .select(["sd.id", "sd.idSale", "sd.idProduct", "sd.discount", "p.nameProduct", "p.price", "p.imgProduct"])
            .leftJoin("products as p", "p.idProduct", "sd.idProduct")
            .whereRef("sd.idSale", "=", "sale.idSale")
        ).as("detail"),
      ])
      .where("sale.idSale", "=", idSale)
      .execute();
  };
  public eventProductGetAll = async () => {
    return await db
      .selectFrom("products")
      .select((eb: any) => [
        "idProduct",
        "nameProduct",
        "imgProduct",
      ])
      .execute();
  };
}
