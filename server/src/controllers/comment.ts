import type { Request, Response } from "express";
import CommentStatement from "service/comment";
import Statements, { ConditionType } from "service/statement";
import type { RequestCustom } from "types/types";
import { responseData, responseMessageData } from "utils/response";
import { convertData, handleChangeData, handleFindData, logData } from "utils/utils";

const statement = new Statements()
const commentStatement = new CommentStatement()
export default class CommentController {
  public getAll = async (req: Request, res: Response) => {
    const name = req.params["name"]
    handleFindData(res, name === "product" ? commentStatement.getAllCommentProduct() : commentStatement.getAllCommentPost())
  }
  public getByProduct = async (req: Request, res: Response) => {
    const idProduct = req.params["id"]
    const current_page = req.params["page"] ? Number(req.params["page"]) : 1
    try {
      const getCount = await commentStatement.getCountComment(Number(idProduct), "comments");
      const getData = await commentStatement.getByProduct(Number(idProduct), Number(current_page))
      const total_p = Math.ceil((getCount.flatMap((t: any) => t.total)[0] / 4))

      const resultData = {
        total: getCount.flatMap((t: any) => t.total)[0],
        total_page: total_p === 0 ? 1 : total_p,
        page: current_page,
        detail: getData
      }
      responseData(res, 200, resultData);
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  }
  public insertComment = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const data = req.body;
    const idUser = req.idUser
    const dataInsert = data.map((c: any) => {
      return {
        ...c,
        idUser: idUser
      }
    })
    const formatData = convertData(dataInsert)
    try {
      const result = await statement.insertData("comments", formatData);
      if (!result) {
        responseMessageData(res, 401, `Add comment is failed`);
      }
      responseMessageData(res, 201, `Add comment is success`, { id: Number(result.insertId) });
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  }
  public editComment = async (req: Request, res: Response) => { }
  public removeComment = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const idUser = req.idUser
    const nameTable: string = req.params["name"]
    const id = req.params["id"]
    const condition: ConditionType = {
      conditionName: nameTable === "product" ? "idComment" : "id",
      conditionMethod: "=",
      value: id
    }
    const logsData = logData(idUser, `Delete comment ${nameTable}`)
    handleChangeData(res, statement.removeData(nameTable === "product" ? 'comments' : "commentPost", condition), 'delete')
  }
}
