import type { Request, Response } from "express";
import type { RequestCustom } from "types/types";
import UserStatement from "service/user";
import Statements, { type ConditionType } from "service/statement";
import { responseData, responseMessage, responseMessageData } from "utils/response";
import { convertData, handleFindData, logData } from "utils/utils";
import { db } from "models/connect";
import AuthStatement from "service/auth";

const userStatement = new UserStatement();
const authStatement = new AuthStatement();
const statement = new Statements();
export default class UserController {
  public changeStatus = async (request: Request, res: Response) => {
    const req = request as RequestCustom;
    const idUser = req.idUser;
    const data = req.body;
    const dataUpdate = convertData([{ action: data.action }])
    const condition: ConditionType = {
      conditionName: "idUser",
      conditionMethod: '=',
      value: data.id
    }
    try {
      const result = await statement.updateDataByCondition("auth", dataUpdate, condition);
      if (!result) {
        return responseMessage(res, 401, `Change status user is failed`);
      }
      responseMessage(res, 200, `Change status user is success`);
    }
    catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  }

  public getUser = async (request: Request, res: Response) => {
    const req = request as RequestCustom;
    const idUser = req.idUser;
    console.log(idUser)
    handleFindData(res, userStatement.getUser(idUser))
  };
  public adminGetInfo = async (request: Request, res: Response) => {
    const req = request as RequestCustom;
    const idUser = req.idUser;
    handleFindData(res, userStatement.adminGetInfo(idUser))
  }
  public admingetShipper = async (request: Request, res: Response) => {
    handleFindData(res, userStatement.getShipper())
  }
  public userUpdate = async (request: Request, res: Response) => {
    const req = request as RequestCustom;
    const idUser = req.idUser;
    const data = req.body;
    const table = data.table ? data.table : 'users';
    const detail = convertData(data.detail);
    const condition: ConditionType = {
      conditionName: data.table === 'staff' ? 'idStaff' : 'idUser',
      conditionMethod: '=',
      value: idUser
    }
    try {
      if (Object.keys(data.detail[0]).includes('email')) {
        const checkMail = await authStatement.getMail(data.detail[0].email)
        if (checkMail.length > 0) {
          return responseMessage(res, 401, 'Email already exists')
        }
      }
      const result = await statement.updateDataByCondition(table, detail, condition)
      if (!result) {
        return responseMessage(res, 401, 'Update is failed')
      }
      const date = new Date().toISOString().split("T")[0]
      const dataUpdate = convertData([{
        'updated_at': date
      }])
      await statement.updateDataByCondition(table, dataUpdate, condition)
      responseMessage(res, 200, 'Update is success')
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  };
  /* 
    insertData:dataOperation:{detail?:'address detail',type?:'extra' | 'default'} 
    updateData/removeData: method:'update'| 'remove', id (this is idAddress):idAddress
    if the method is update, you must add dataOperation. 
    and this is all key from body data:
    {
      type:"add"|"update"|"remove"
      dataOperation("add" | "update"):{detail?:'address detail',typeAddress?:'extra' | 'default'} 
      data.id("update"|"remove"):1
    }
    */
  public userAddress = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const idUser = req.idUser
    const data = req.body
    if (data.type === "add") {
      const formatData = convertData([{ idUser: idUser, ...data.dataOperation }])
      const result = await statement.insertData("userAddress", formatData)
      return responseData(res, 201, { idAddress: Number(result.insertId) })
    }
    if (data.type === "update" || data.type === "remove") {
      const formatData = convertData([{ ...data.dataOperation }])
      const condition: ConditionType = {
        conditionName: "idAddress",
        conditionMethod: "=",
        value: data.id
      }
      if (data.type === "update" && data.dataOperation.typeAddress === "default") {
        await
          db.updateTable("userAddress")
            .set({
              "typeAddress": 'extra'
            })
            .where('idUser', '=', idUser)
            .where('typeAddress', '=', 'default')
            .executeTakeFirst()
      }
      data.type === "update"
        ? statement.updateDataByCondition("userAddress", formatData, condition)
        : statement.removeData("userAddress", condition)
      return responseMessage(res, 200, 'Address change is success')

    }
  }

  public getAllUser = async (request: Request, res: Response) => {
    handleFindData(res, userStatement.getAllUser())
  }
  public getAllStaff = async (request: Request, res: Response) => {
    handleFindData(res, userStatement.getAllStaff())
  }
  public getAllAddress = async (request: Request, res: Response) => {
    handleFindData(res, userStatement.getAllAddress())
  }
}
