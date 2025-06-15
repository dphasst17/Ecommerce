import type { Request } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayloadCustom extends jwt.JwtPayload {
  exp: number;
}
export interface RequestCustom extends Request {
  idUser: string;
}
export type OrderStatusType = "pending" | "prepare" | "shipping" | "delivery" | "canceled" | "success" | "failed";
export interface LogsType {
  idUser: string,
  content: string,
  date: Date,
  time: string
}
export interface ProductType {
  idProduct: number,
  nameProduct: string,
  price: number,
  imgProduct: string,
  total?: number
  dateAdded?: Date
  des?: string,
  view?: number,
  idType: number,
  brand: string,
  status?: "show" | "hide",
  detail?: [],
  [x: string]: any
}
export interface UserType {
  idUser: string,
  nameUser: string,
  img?: string,
  email?: string,
  phone?: string,
  created_at?: Date,
  updated_at?: Date,
}
export interface StaffType {
  idStaff: string,
  name: string,
  avatar?: string,
  email?: string,
  phone?: string,
  birthday?: Date,
  address: string,
  created_at?: Date,
  updated_at?: Date,
}
export interface PositionType {
  position_id?: number,
  idStaff?: string,
  position_name?: string
}
export interface UserAddressType {
  idAddress: number,
  idUser: string,
  typeAddress: 'default' | 'extra',
  detail: string,
}
export interface CartType {
  idUser: string,
  idProduct?: number,
  countProduct?: number,
  detail?: string | any | null
}

export interface TypeProduct {
  idType: number,
  nameType: string,
  image_url: string,
  count?: number
}
export interface TypeDetail {
  id: string,
  type: string,
  name: string,
  datatypes: string,
  displayname: string,
  displayorder: number
}
export interface OrderType {
  idOrder: string,
  idUser: string | null,
  idShipper: string,
  created_at: string,
  fullName: string,
  phone: string,
  address: string,
  costs: number,
  method: string,
  edd: Date,
  paymentStatus: 'paid' | 'unpaid',
  orderStatus: string,
  note: string
}
export interface OrderDetailType {
  idOrdDetail: number,
  idOrder: string,
  idProduct: number,
  countProduct: number,
  discount: number,
  status: string
}

export interface SaleType {
  idSale: number,
  start_date: Date,
  end_date: Date,
  title: string
}
export interface SaleDetailType {
  id: number,
  idSale: number,
  idProduct: number,
  discount: number
}
export interface CategoryPostsType {
  idType: number,
  nameType: string,
  create_at: Date,
  update_at: Date
}
export interface PostsType {
  idPost?: number,
  dateAdded: Date,
  idType: number,
  nameType?: string,
  poster: string,
  title: string,
  thumbnails: string,
  valuesPosts: string,
}
export interface ImageProductType {
  idImg: number,
  idProduct: number,
  type: "extra" | "default",
  img: string

}
export interface CommentType {
  idComment: number,
  commentValue: string,
  idProduct: number,
  dateComment: string,
  idUser: string
}
export interface CommentPostType {
  id: number,
  idUser: string,
  idPost: number,
  created_date: Date,
  commentValue: string,
  [x: string]: string | Date | number
}
export interface PaymentType {
  id: number,
  payment_id: string,
  method: string,
  total_price: number,
  currency_code: string
}