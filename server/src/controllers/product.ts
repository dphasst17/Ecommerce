import type { Request, Response } from "express";
import ProductStatement from "service/product";
import Statement, { type ConditionType } from "service/statement"
import type { ProductType, RequestCustom, TypeDetail } from "types/types";
import { responseData, responseMessage, responseMessageData } from "utils/response";
import { convertData, handleFindData } from "utils/utils";
const products = new ProductStatement();
const statement = new Statement()
export default class ProductController {
  //Category
  public getAllType = async (req: Request, res: Response) => {
    try {
      const result = await products.findAllType();
      const sortData = result.map((r: any) => {
        return {
          ...r,
          count: r.count[0].count,
          detail: r.detail.sort((a: any, b: any) => a.displayorder - b.displayorder)
        }
      })
      responseData(res, 200, sortData);
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  };
  public getDetailType = async (req: Request, res: Response) => {
    const type = req.params["type"];
    try {
      const result = await products.findDetailType(type);
      const sortData = result.map((r: any) => {
        return {
          ...r,
          detail: r.detail.sort((a: any, b: any) => a.displayorder - b.displayorder)
        }
      })
      responseData(res, 200, sortData);
    }
    catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  };
  public insertCategory = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const data = req.body;
    const type = data.nameType && convertData([{ nameType: data.nameType }])

    const dataTypeDetail = data.table.map((x: any) => ({
      id: `${data.nameType ? data.nameType : x.type}${x.name}`,
      name: x.name,
      type: data.nameType ? data.nameType : x.type,
      datatypes: x.datatypes === "varchar" ? "text" : ((x.datatypes === "int" || x.datatypes === "integer") ? "number" : "longtext"),
      displayorder: Number(x.displayorder),
      displayname: x.displayname,
    }))

    try {
      const insertType = data.nameType && await statement.insertData('type', type);
      const createTableDetail = data.nameType && await statement.table('add', data.nameType, data.table);
      const insertTypeDetail = await statement.insertDataMulti('typedetail', dataTypeDetail);
      insertTypeDetail ?
        (
          data.nameType
            ? responseMessageData(res, 201, 'Add new category is success', { id: Number(insertType.insertId) })
            : responseMessage(res, 200, 'Add new column is success')
        )
        : responseMessage(res, 500, "Server errors");
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  };
  public getColByType = async (req: Request, res: Response) => {
    const type = req.params['nameType']
    handleFindData(res, products.getColumnByType(type))
  };
  public removeCategory = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const data = req.body;
    const condition: ConditionType = {
      conditionName: "nameType",
      conditionMethod: "=",
      value: data.type
    }
    const conditionDetail: ConditionType = {
      conditionName: "type",
      conditionMethod: "=",
      value: data.type
    }
    try {
      const deleteType = await statement.table('remove', data.type);
      const deleteRow = await statement.removeData('type', condition);
      const deleteTypeDetail = await statement.removeData('typedetail', conditionDetail);
      (deleteType === undefined && deleteRow && deleteTypeDetail) ? responseMessage(res, 200, 'Delete category is success')
        : responseMessage(res, 500, "Server errors")
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  };
  public deleteColCategory = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const data = req.body;
    const condition: ConditionType = {
      conditionName: "id",
      conditionMethod: "=",
      value: data.id
    }
    try {
      const deleteCol = await statement.columnChange("remove", data.table, data.col)
      /* const deleteRow:any = await statement.removeData('type_detail', condition)
      (deleteCol === undefined || deleteRow) ? responseMessage(res, 200, 'Delete column is success') : responseMessage(res, 500, "Server errors") */
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  };
  //Product
  public insertProduct = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const data = req.body;
    const product = convertData(data.product)
    try {
      const insertProduct = await statement.insertData('products', product);
      const dataImages = data.images.map((i: any) => ({ idProduct: Number(insertProduct.insertId), ...i }))
      const insertImages = await statement.insertDataMulti('image', dataImages)
      const detail = convertData(data.detail.map((d: any) => ({ ...d, idProduct: Number(insertProduct.insertId) })))
      const insertDetail = await statement.insertData(data.tableName, detail)
      insertProduct && insertDetail ?
        responseMessageData(res, 201, 'Add new product is success', { id: Number(insertProduct.insertId) })
        : responseMessage(res, 500, "Server errors");
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  };
  public insertImages = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const data = req.body;
    try {
      const insertDetail = await statement.insertDataMulti('image', data);
      insertDetail
        ? responseMessageData(res, 201, 'Add new image is success', { firstId: Number(insertDetail[0].insertId) })
        : responseMessage(res, 500, "Server errors");
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  }
  public updateImage = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const data = req.body;
    const condition: ConditionType = {
      conditionName: "img",
      conditionMethod: "=",
      value: data.urlDefault
    }
    const conditionProduct: ConditionType | null = data.type === "update" ? {
      conditionName: "idProduct",
      conditionMethod: "=",
      value: data.idProduct
    } : null
    try {
      const updateImage = data.type === "update" ? await statement.updateDataByCondition('image', convertData([{ img: data.url }]), condition)
        : await statement.removeData('image', condition)
      const updateImgDefault = conditionProduct ? await statement.updateDataByCondition('products', convertData([{ imgProduct: data.urlDefault }]), conditionProduct) : null
      if (data.type === "update" && !updateImage) {
        const restoreData = await statement.updateDataByCondition('image', data.urlDefault, condition)
        return responseMessageData(res, 403, "Update image is failed", restoreData)
      }
      updateImage
        ? responseMessage(res, 200, data.type === "update" ? 'Update image is success' : 'Delete image is success')
        : responseMessage(res, 500, "Server errors");
    }
    catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  }
  public updateProduct = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const data = req.body;
    const detail = convertData(data.data_update)
    const conditionValue = data.condition
    const condition: ConditionType = {
      conditionName: conditionValue.name,
      conditionMethod: "=",
      value: conditionValue.value
    }
    try {
      const updateDetail = await statement.updateDataByCondition(data.tableName, detail, condition);
      updateDetail
        ? responseMessage(res, 200, 'Update product is success')
        : responseMessage(res, 500, "Server errors");
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  };
  public getAll = async (req: Request, res: Response) => {
    const { total, page, limit } = req.query
    try {
      const result = await products.findAll(Number(limit || 20), Number(page || 1));
      const totalData: any = total ? [{ total: Number(total) }] : await products.countData();
      const totalValue = totalData[0]?.total;
      const dataRes = {
        total: totalValue,
        total_page: Math.ceil(Number(totalValue) / Number(limit)),
        page: Number(page),
        limit: Number(limit),
        data: result
      };
      responseData(res, 200, dataRes);
    }
    catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  };
  public getProductByType = async (req: Request, res: Response) => {
    const typeName = req.params["nameType"];
    const colType = await products.getColumnByType(typeName);
    const colDetail = colType.map((c: any) => c.name);
    const shortKey = typeName.slice(0, 3);
    handleFindData(res, products.findByType(typeName, shortKey, colDetail));
  };
  public getDetail = async (req: Request, res: Response) => {
    const idProduct = req.params["idProduct"];
    const data = req.body
    const type = data.type
    const role = data.role
    const colType = await products.getColumnByType(type);
    const colDetail = colType.map((c: any) => c.name);
    try {
      const result = <ProductType[]>await products.findDetail(Number(idProduct), type, colDetail);
      //Update view product
      if (role === "user") {
        const resultView = convertData([{ view: result[0].view ? result[0].view + 1 : 1 }])
        const condition: ConditionType = {
          conditionName: "idProduct",
          conditionMethod: "=",
          value: idProduct
        }
        const updateView = await statement.updateDataByCondition("products", resultView, condition);
      }
      //
      const parseResult = result.map((e: any) => {
        let subImg = e.img;
        let formatResult = {
          ...e,
          imgProduct: subImg.every((c: any) => Object.values(c).every((value) => value === null))
            ? [{ img: e.imgProduct, type: "default" }]
            : [{ img: e.imgProduct, type: "default" }, ...subImg],

        };
        delete formatResult.img;
        return formatResult;
      });
      responseData(res, 200, parseResult);
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  };
  public adminGetDetailProduct = async (req: Request, res: Response) => {
    const type = req.params["type"];
    const idProduct = req.params["idProduct"];
    const colType = await products.getColumnByType(type);
    const colDetail = colType.map((c: any) => c.name);
    try {
      const result = <ProductType[]>await products.findDetail(Number(idProduct), type, colDetail);
      const parseResult = result.map((e: any) => {
        let subImg = e.img;
        let formatResult = {
          ...e,
          imgProduct: subImg.every((c: any) => Object.values(c).every((value) => value === null))
            ? [{ img: e.imgProduct, type: "default" }]
            : [{ img: e.imgProduct, type: "default" }, ...subImg],

        };
        delete formatResult.img;
        return formatResult;
      });
      responseData(res, 200, parseResult);
    } catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  }
  public getNew = async (req: Request, res: Response) => {
    handleFindData(res, products.findByCondition("new"));
  };
  public getView = async (req: Request, res: Response) => {
    handleFindData(res, products.findByCondition("view"));
  };
  public search = async (req: Request, res: Response) => {
    const keyword = req.params["key"];
    handleFindData(res, products.findByKey(keyword));
  };
  //Event
  public insertSaleEvent = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const data = req.body;
    const sale = convertData([data.sale]);

    try {
      const insertSale = await statement.insertData('sale', sale)
      const dataDetail = data.detail.map((e: any) => {
        return { ...e, idSale: Number(insertSale.insertId) }
      })
      const insertDetail = await statement.insertDataMulti('saleDetail', dataDetail)
      insertSale && insertDetail ?
        responseMessageData(res, 201, 'Add new sale event is success', { id: Number(insertSale.insertId) })
        : responseMessage(res, 500, "Server errors");
    }
    catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  };
  public updateSaleEvent = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const data = req.body;
    const idSale = data.idSale;
    const sale = data.sale && convertData(data.sale)
    const saleDetail = data.detail && convertData(data.detail)

    const condition: ConditionType = {
      conditionName: "idSale",
      conditionMethod: "=",
      value: idSale
    }
    const conditionDetail: ConditionType = {
      conditionName: "id",
      conditionMethod: "=",
      value: data.idDetail
    }

    try {
      const updateSale = data.sale && await statement.updateDataByCondition('sale', sale, condition);
      const updateDetail = data.detail && await statement.updateDataByCondition('saleDetail', saleDetail, conditionDetail);

      (updateSale || updateDetail) ?
        responseMessage(res, 200, 'Update product is success')
        : responseMessage(res, 500, "Server errors");
    }
    catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  };
  public deleteSaleEvent = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const data = req.body;
    const idSale = data.idSale;
    const condition: ConditionType = {
      conditionName: "idSale",
      conditionMethod: "=",
      value: idSale
    }
    try {
      const deleteDetail = await statement.removeData('saleDetail', condition);
      const deleteSale = await statement.removeData('sale', condition);
      (deleteSale || deleteDetail) ?
        responseMessage(res, 200, 'Delete sale event is success')
        : responseMessage(res, 500, "Server errors");
    }
    catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  };
  public deleteItemSaleEvent = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const data = req.body;
    const idDetail = data.idDetail;
    const condition: ConditionType = {
      conditionName: "id",
      conditionMethod: "=",
      value: idDetail
    }
    try {
      const deleteDetail = await statement.removeData('saleDetail', condition);
      (deleteDetail) ?
        responseMessage(res, 200, 'Delete sale event is success')
        : responseMessage(res, 500, "Server errors");
    }
    catch {
      (errors: any) => {
        responseMessageData(res, 500, "Server errors", errors);
      };
    }
  };
  public getAllSaleEvent = async (req: Request, res: Response) => {
    handleFindData(res, products.findAllSaleEvent());
  };
  public getSale = async (req: Request, res: Response) => {
    const currentDate = new Date().toISOString().split('T')[0]
    handleFindData(res, products.findSale(currentDate));
  }
  public getSaleDetail = async (req: Request, res: Response) => {
    const idSale = req.params["idSale"];
    handleFindData(res, products.findSale_detail(Number(idSale)));
  };
  public eventProductGetAll = async (req: Request, res: Response) => {
    handleFindData(res, products.eventProductGetAll());
  };

}
