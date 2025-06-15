import { db } from "../models/connect";

export default class OrderStatement {
  public getCountItem = async (idOrder: string) => {
    return await db
      .selectFrom("order_detail")
      .select("idOrder")
      .where("idOrder", "=", `${idOrder}`)
      .execute();
  }
  public getCountOrder = async (limit: number, page: number, idShipper?: string) => {
    let query = db.selectFrom("order").select((eb: any) => eb.fn.count("idOrder").as("total"))
    return idShipper ? await query.where("order.idShipper", "=", idShipper).limit(limit).offset((page - 1) * limit).execute()
      : await query.limit(limit).offset((page - 1) * limit).execute()
  }
  public getAllOrder = async (limit: number, page: number) => {
    return await db
      .selectFrom("order")
      .select(["idOrder",  "fullName", "phone", "address", "method", "paymentStatus", "orderStatus", /* "note", */ "idShipper"])
      /* .orderBy("created_at", "desc") */
      .limit(limit)
      .offset((page - 1) * limit)
      .execute();
  };
  public getDetailOrder = async (idOrder: string) => {
    return await db.selectFrom("order_detail as od")
      .select(["od.idOrdDetail", "od.idOrder", "od.idProduct", "p.nameProduct", "p.imgProduct", "od.countProduct", "p.price", "od.discount"])
      .leftJoin("products as p", "od.idProduct", "p.idProduct")
      .where("od.idOrder", "=", `${idOrder}`)
      .orderBy("od.idOrdDetail asc")
      .execute()
  };
  public getOrderByRoleShipper = async (idShipper: string, limit: number, page: number) => {
    return await db
      .selectFrom("order")
      .selectAll()
      .where("idShipper", "=", idShipper)
      /* .orderBy("created_at", "desc") */
      .limit(limit)
      .offset((page - 1) * limit)
      .execute();
  }
  public getOrderByUser = async (idUser: string) => {
    return await db
      .selectFrom("order_detail as od")
      .select(["od.idOrdDetail", "od.idOrder", "od.idProduct", "p.nameProduct", "p.imgProduct", "od.countProduct", "p.price", "od.discount", "order.orderStatus", "order.paymentStatus"])
      .leftJoin("order", "od.idOrder", "order.idOrder")
      .leftJoin("products as p", "od.idProduct", "p.idProduct")
      .where("order.idUser", "=", idUser)
      .where("order.orderStatus", "!=", "success")
      .where("order.orderStatus", "!=", "fail")
      .execute()
  };
  public getPurchaseOrderByUser = async (idUser: string) => {
    return await db
      .selectFrom("order_detail as od")
      .select(["od.idOrder", "od.idProduct", "p.nameProduct", "p.imgProduct", "od.countProduct", "p.price", "od.discount"])
      .leftJoin("order", "od.idOrder", "order.idOrder")
      .leftJoin("products as p", "od.idProduct", "p.idProduct")
      .where("order.idUser", "=", idUser)
      .where("order.orderStatus", "=", "success")
      .execute()
  }
  public getTransportDetail = async (idOrder: string) => {
    return await db
      .selectFrom("order_detail as od")
      .select(["od.idOrder", "od.idProduct", "p.nameProduct", "p.imgProduct", "od.countProduct", "p.price", "od.discount"])
      .leftJoin("products as p", "od.idProduct", "p.idProduct")
      .where("idOrder", "=", idOrder)
      .execute()
  };
}
