import type { Request, Response } from "express";
import StatisticalStatement from "service/statistical";
import { handleFindData } from "utils/utils";

const statisticalStatement = new StatisticalStatement()
export default class StatisticalController {
    public product = (req: Request, res: Response) => {
        handleFindData(res, statisticalStatement.productAnalyze())
    }
    public user = (req: Request, res: Response) => {
        handleFindData(res, statisticalStatement.user())
    }
    public order = (req: Request, res: Response) => {
        handleFindData(res, statisticalStatement.orderAnalyze())
    }
    public orderList = (req: Request, res: Response) => {
        handleFindData(res, statisticalStatement.order())
    }
    public countOrder = (req: Request, res: Response) => {
        handleFindData(res, statisticalStatement.countOrder())
    }
    public commentPost = (req: Request, res: Response) => {
        handleFindData(res, statisticalStatement.commentPost())
    }
    public commentProduct = (req: Request, res: Response) => {
        handleFindData(res, statisticalStatement.commentProduct())
    }
    public revenue = (req: Request, res: Response) => {
        handleFindData(res, statisticalStatement.revenue())
    }
}
