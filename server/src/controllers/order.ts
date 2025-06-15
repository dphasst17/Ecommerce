import type { Request, Response } from "express";
import Statements, { type ConditionType } from "service/statement";
import OrderStatement from "../service/order";
import type { RequestCustom } from "types/types";
import { responseData, responseMessage, responseMessageData } from "utils/response";
import { convertData, handleFindData, logData } from "utils/utils";
import crypto from "crypto";
import { sql } from "kysely";
import { db } from "models/connect";

const order = new OrderStatement();
const statement = new Statements();
let dateObj = new Date();
let month = dateObj.getUTCMonth() + 1;
let year = dateObj.getUTCFullYear();
const randomText = (length: number) => {
  return crypto.randomBytes(length).toString("hex");
};
export default class OrderController {
  constructor() { }
  public getAll = async (req: Request, res: Response) => {
    const { total, limit, page } = req.query
    console.log("Start Order")
    try {
      const totalData: any = total ? [{ total: Number(total) }] : await order.getCountOrder(Number(limit), Number(page))
      const totalValue = totalData[0].total
      const result = await order.getAllOrder(Number(limit), Number(page))
      const resultData = {
        total: totalValue,
        total_page: Math.ceil(totalValue / Number(limit)),
        page: Number(page),
        data: result
      }
      responseData(res, 200, resultData);
    }
    catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  };
  public getDetail = async (req: Request, res: Response) => {
    const idOrder = req.params["id"];
    handleFindData(res, order.getDetailOrder(idOrder));
  };
  public getOrderByRoleShipper = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const idUser = req.idUser
    const { total, limit, page } = req.query
    try {
      const totalData: any = total ? [{ total: Number(total) }] : await order.getCountOrder(Number(limit), Number(page), idUser)
      const totalValue = totalData[0].total
      const result = await order.getOrderByRoleShipper(idUser, Number(limit), Number(page))
      const resultData = {
        total: totalValue,
        total_page: Math.ceil(totalValue / Number(limit)),
        page: Number(page),
        data: result
      }
      responseData(res, 200, resultData);
    }
    catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  }
  public getByUser = async (request: Request, res: Response) => {
    const req = request as RequestCustom;
    const idUser = req.idUser;
    handleFindData(res, order.getOrderByUser(idUser));
  };
  public insertOrder = async (request: Request, res: Response) => {
    const req = request as RequestCustom;
    const idUser = req.idUser;
    const data = req.body;
    const idOrder = `${idUser}${month}${year}-${randomText(4)}`;
    const addData = data.order.map((c: any) => {
      return {
        ...c,
        idOrder: idOrder,
        idUser: idUser,
        created_at: new Date().toISOString().split("T")[0],
        note: ''
      };
    });
    const insertData = await db.transaction().execute(async (trx) => {
      const formatData = convertData(addData)
      const insert = await statement.insertData("order", formatData)
      const setFk = sql`SET FOREIGN_KEY_CHECKS=0`.execute(trx);
      const tableInsert = "order_Detail";
      const colInsert = ["idOrder", "idProduct", "countProduct", "discount"]
      const tableSelect = "carts"
      const colSelect = [
        sql`${idOrder}`,
        "carts.idProduct",
        "carts.countProduct",
        sql`IF(sale.end_date >= CURDATE() AND sale.start_date <= CURDATE(), IFNULL(sd.discount, 0), 0)`.as("discount")
      ]
      const conditionDetail: ConditionType = {
        conditionName: "carts.idCart",
        conditionMethod: "in",
        value: data.listId
      }
      const join = [
        {
          table: "products as p",
          key1: "p.idProduct",
          key2: "carts.idProduct",
          type: "innerJoin"
        },
        {
          table: "saleDetail as sd",
          key1: "p.idProduct",
          key2: "sd.idProduct",
          type: "leftJoin"
        },
        {
          table: "sale",
          key1: "sd.idSale",
          key2: "sale.idSale",
          type: "leftJoin"
        }
      ]
      const insertDetail = await statement.insertSubQuery(tableInsert, colInsert, tableSelect, colSelect, conditionDetail, join)
      const rmFk = sql`SET FOREIGN_KEY_CHECKS=1`.execute(trx);
      return { insert, setFk, insertDetail, rmFk };
    });
    if (!insertData.insertDetail[0].insertId) {
      return responseMessage(res, 401, "Order failed");
    }
    responseMessageData(res, 201, "Order success", { idOrder: idOrder, detail: { fistId: Number(insertData.insertDetail[0].insertId), length: data.listId.length } });
  };
  public adminInsertOrder = async (request: Request, res: Response) => {
    const req = request as RequestCustom;
    const idUser = req.idUser;
    const data = req.body;
    const idOrder = `${idUser}${month}${year}-${randomText(4)}`;
    const dataOrder = data.order.map((c: any) => {
      return {
        ...c,
        idOrder: idOrder,
        created_at: new Date().toISOString().split("T")[0],
      };
    });
    const dataOrderDetail = data.detail.map((c: any) => ({
      ...c,
      idOrder: idOrder
    }))
    const logsData = logData(req.idUser, `${idUser} create order with id ${idOrder}`)
    try {
      console.log("Start order")
      const insertData = await statement.insertData("order", convertData(dataOrder));
      const insertDataDetail = await statement.insertDataMulti("order_Detail", dataOrderDetail);
      if (!insertData || !insertDataDetail) {
        return responseMessage(res, 401, "Order failed");
      }
      responseMessageData(res, 201, "Order success", { id: idOrder, date: new Date().toISOString().split("T")[0] });
    }
    catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  }
  public updateOrder = async (request: Request, res: Response) => {
    const req = request as RequestCustom;
    const data = req.body;
    const valueUpdate = convertData(data.data_update)
    const condition: ConditionType = {
      conditionName: "idOrder",
      conditionMethod: "=",
      value: data.id,
    };
    const logsData = logData(req.idUser, `Update order status to ${data.data_update[0].orderStatus}`)
    try {
      const updateStatus = await statement.updateDataByCondition("order", valueUpdate, condition);
      if (!updateStatus) {
        return responseMessage(res, 401, "Status update failed");
      }
      //update total product
      if (data.data_update[0].orderStatus === "delivery") {
        console.log(data.dataProduct)
        const updatePromise = data.product.map((p: { idProduct: number, countProduct: number }) => {
          db.updateTable("products").set({ total: sql`total - ${p.countProduct}` }).where("idProduct", "=", p.idProduct).execute()
        })
        await Promise.all(updatePromise)
      }
      if (data.data_update[0].orderStatus === "failed") {
        const updatePromise = data.product.map((p: { idProduct: number, countProduct: number }) => {
          db.updateTable("products").set({ total: sql`total + ${p.countProduct}` }).where("idProduct", "=", p.idProduct).execute()
        })
        await Promise.all(updatePromise)
      }
      responseMessage(res, 200, "Update status success");
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  };
  public getPurchaseOrderByUser = async (request: Request, res: Response) => {
    const req = request as RequestCustom;
    const idUser = req.idUser
    handleFindData(res, order.getPurchaseOrderByUser(idUser))
  }
  public deleteOrderItem = async (req: Request, res: Response) => {
    const data = req.body
    const condition: ConditionType = {
      conditionName: "idOrdDetail",
      conditionMethod: "=",
      value: data.idOrdDetail
    }
    try {
      const getCountItem = await order.getCountItem(data.idOrder)
      const deleteData = await statement.removeData("order_Detail", condition);
      if (getCountItem.length === 1) {
        const condition: ConditionType = {
          conditionName: "idOrder",
          conditionMethod: "=",
          value: data.idOrder
        }
        const deleteData = await statement.removeData("order", condition);
        if (!deleteData) {
          return responseMessage(res, 401, "Delete order failed");
        }
        return responseMessage(res, 200, "Delete order success");
      }
      if (!deleteData) {
        return responseMessage(res, 401, "Delete order item failed");
      }
      responseMessage(res, 200, "Delete order item success");
    }
    catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  }
}
