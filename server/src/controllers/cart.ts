import type { Request, Response } from "express";
import type { ConditionType } from "service/statement";
import Statements from "service/statement";
import type { RequestCustom } from "types/types";
import { responseData, responseMessageData } from "utils/response";
import { convertData, handleChangeData } from "utils/utils";

const statement = new Statements();
export default class CartController {
  //idProduct, count
  public cartInsert = async (request: Request, res: Response) => {
    const req = request as RequestCustom;
    const idUser = req.idUser;
    const data = req.body;
    const formatData = data.cart.map((c: any) => {
      return {
        ...c,
        idUser: idUser
      }
    })
    const dataInsert = convertData(formatData);
    try {
      const result = await statement.insertData("carts", dataInsert);
      responseData(res, 201, { idCart: Number(result.insertId) });
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  };
  public cartUpdateCount = async (req: Request, res: Response) => {
    const data = req.body;
    const condition: ConditionType = {
      conditionName: "idCart",
      conditionMethod: "=",
      value: data.id,
    };
    const dataUpdate = {
      nameCol: "countProduct",
      value: data.value,
    };
    handleChangeData(res, statement.updateDataByCondition("carts", [dataUpdate], condition), "update")
  };
  public cartRemove = async (req: Request, res: Response) => {
    const data = req.body;
    const condition: ConditionType = {
      conditionName: "idCart",
      conditionMethod: "in",
      value: data.listId,
    };
    handleChangeData(res, statement.removeData("carts", condition), "delete")
  }
}
