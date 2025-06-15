import type { Request, Response } from "express";
import PostStatement from "service/posts";
import Statements, { type ConditionType } from "service/statement";
import { responseData, responseMessageData } from "utils/response";
import { convertData, handleChangeData, handleFindData, logData } from "utils/utils";
import type { RequestCustom } from "types/types";
import CommentStatement from "service/comment";


const statement = new Statements();
const postStatement = new PostStatement();
const commentStatement = new CommentStatement();
export default class PostsController {
  public getAll = async (req: Request, res: Response) => {
    handleFindData(res, postStatement.getAll());
  };
  public getCategory = async (req: Request, res: Response) => {
    handleFindData(res, postStatement.getCategory());
  };
  public getDetail = async (req: Request, res: Response) => {
    const idPosts = req.params["id"];
    handleFindData(res, postStatement.getDetail(Number(idPosts)));
  };
  public createCategory = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const idUser = req.idUser
    const data = req.body
    const newData = convertData([data])
    const logsData = logData(idUser, "Create new category")
    try {
      const result = await statement.insertData("typePost", newData)
      if (!result) {
        return responseMessageData(res, 401, `Category created is failed`);
      }
      responseMessageData(res, 201, `Category created is success`, { id: Number(result.insertId) });
    }
    catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
        throw errors
      };
    }
  }
  public insertPost = async (request: Request, res: Response) => {
    const req = request as RequestCustom;
    const data = req.body;
    const idUser = req.idUser
    const dataInsert = {
      ...data,
      poster: idUser
    }
    const logsData = logData(idUser, "Create new post")
    try {
      const result = await postStatement.createPost(dataInsert);
      if (!result) {
        return responseMessageData(res, 401, `Post created is failed`);
      }
      responseMessageData(res, 201, `Post created is success`, { id: Number(result.insertId), poster: idUser });
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
        throw errors
      };
    }
  }
  public insertCommentPost = async (request: Request, res: Response) => {
    const req = request as RequestCustom;
    const idUser = req.idUser;
    const data = req.body;
    const addData = data.map((p: any) => {
      return {
        ...p,
        idUser: idUser,
      };
    });
    const changeData = convertData(addData);
    try {
      const result = await statement.insertData("commentPost", changeData);
      if (!result) {
        return responseMessageData(res, 401, `Comment for post is failed`);
      }
      responseMessageData(res, 201, `Comment for post is success`, { id: Number(result.insertId) });
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
        throw errors
      };
    }
  };
  public updatePost = async (req: Request, res: Response) => {
    const data = req.body;
    const changeData = convertData(data.detail);
    const condition: ConditionType = {
      conditionName: "idPost",
      conditionMethod: "=",
      value: data.id,
    };
    const logsData = logData(data.idUser, "Update post")
    handleChangeData(res, statement.updateDataByCondition("posts", changeData, condition), "update");
  };
  public removePost = async (request: Request, res: Response) => {
    const req = request as RequestCustom;
    const idUser = req.idUser
    const data = req.body;
    const condition: ConditionType = {
      conditionName: "idPost",
      conditionMethod: "=",
      value: data.id,
    };
    const logsData = logData(idUser, "Delete post")
    handleChangeData(res, statement.removeData("posts", condition), "delete");
  }
  public getCommentPost = async (req: Request, res: Response) => {
    const idPost = req.params['id']
    const current_page = req.params["page"] ? Number(req.params["page"]) : 1
    try {
      const getCount = await commentStatement.getCountComment(Number(idPost), "commentPost");
      const getData = await commentStatement.getByPost(Number(idPost), Number(current_page))
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
}
