import type { Request, Response } from "express";
import type { columnAddType } from "service/statement";
import Statements from "service/statement";
import { responseMessageData } from "utils/response";

const statement = new Statements()
export default class TableController {
  public create = async (req: Request, res: Response) => {
    const data = req.body
    const method = "add"
    const tbName = data.table
    const column: columnAddType[] = data.column
    try {
      const result: any = await statement.table(method, tbName, column);
      if (result) {
        return responseMessageData(res, 401, `Create data is failed`);
      }
      responseMessageData(res, 201, `Create data is success`);
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  }
  public update = async (req: Request, res: Response) => {
    const data = req.body
    const method = data.method
    const table = data.table
    const column: columnAddType[] | string = data.method === "add" ? data.colAdd : data.colDel
    try {
      const result = await statement.columnChange(method, table, column)
      if (result) {
        return responseMessageData(res, 401, `Update data is failed`);
      }
      responseMessageData(res, 200, `Update data is success`);
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  }
  public delete = async (req: Request, res: Response) => {
    const data = req.body
    const method = "remove"
    const tbName = data.table
    try {
      const result: any = await statement.table(method, tbName);
      if (result) {
        return responseMessageData(res, 401, `Remove data is failed`);
      }
      responseMessageData(res, 200, `Remove data is success`);
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  }
  public deleteColumn = async (req: Request, res: Response) => {
    const data = req.body
    const method = "remove"
    const tbName = data.table
    const column = data.column
    try {
      const result: any = await statement.columnChange(method, tbName, column);
      if (!result) {
        return responseMessageData(res, 401, `Remove data is failed`);
      }
      responseMessageData(res, 200, `Remove data is success`);
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  }
}