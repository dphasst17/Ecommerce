import { LogsType } from "types/types";
import { responseData, responseMessageData } from "./response";

export const convertData = (arr: any[]) => {
  return Object.keys(arr[0]).map((c: string) => {
    return { nameCol: c, value: arr[0][c] };
  });
};
export const convertMultiData = (arr: any[]) => {
  const getKey = Object.keys(arr[0]);
  const formatData = arr.map((a: any) => {
    return getKey.map((k: string) => {
      return {
        nameCol: k,
        value: a[k],
      };
    });
  })
  return formatData;
};

export const handleFindData = async (res: any, handle: any,) => {
  try {
    const result = await handle;
    responseData(res, 200, result);
  } catch {
    (errors: any) => {
      responseMessageData(res, 500, "Server errors", errors);
    };
  }
};
export const handleChangeData = async (res: any, handle: any, method: "add" | "update" | "delete") => {
  try {
    const result = await handle;
    if (!result) {
      return responseMessageData(res, 401, `${method.toUpperCase()} is failed`);
    }
    responseMessageData(res, method === "add" ? 201 : 200, `${method.toUpperCase()} is success`);
  } catch {
    (errors: any) => {
      responseMessageData(res, 500, "Server errors", errors);
    };
  }
}
export const logData = (idUser: string, content: string): LogsType => {
  const time = new Date().toLocaleTimeString()
  const date = new Date()
  return {
    idUser: idUser,
    content: content,
    date: date,
    time: time
  }
}
