import type { AuthDB } from "types/auth";
import type {
  CartType,
  CategoryPostsType,
  CommentPostType,
  CommentType,
  ImageProductType,
  OrderDetailType,
  OrderType,
  PaymentType,
  PositionType,
  PostsType,
  ProductType,
  SaleDetailType,
  SaleType,
  StaffType,
  TypeDetail,
  TypeProduct,
  UserAddressType,
  UserType,
} from "types/types";

export interface Database {
  carts: CartType;
  comments: CommentType;
  commentPost: CommentPostType,
  image: ImageProductType;
  auth: AuthDB;
  posts: PostsType;
  typePost: CategoryPostsType;
  payment: PaymentType;
  products: ProductType;
  sale: SaleType;
  saleDetail: SaleDetailType;
  order: OrderType;
  order_Detail: OrderDetailType;
  type: TypeProduct;
  type_detail: TypeDetail;
  userAddress: UserAddressType;
  users: UserType;
  staff: StaffType;
  position: PositionType;

  [anyTable: string]: any;
}

