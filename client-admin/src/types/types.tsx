export interface StatusValueType {
    current: string,
    next: string,
}
export interface LogsType {
    _id: string,
    idUser: string,
    content: string,
    timestamp: string
}
export interface CustomerUpdateType {
    table: string
    detail: { [x: string]: string | number }[]
}
export interface Responses {
    total: number,
    total_page: number,
    page: number,
    limit: number
}
export interface ProductResponse extends Responses {
    data: ProductType[]
}
export interface OrderResponse extends Responses {
    data: OrderType[]
}
export interface ProductType {
    idProduct: number,
    nameProduct: string,
    price: number,
    imgProduct?: string,
    idType?: number,
    brand?: string,
    nameType?: string,
    discount?: number,
    total?: number,
    view?: number,
    action?: "show" | "hide"
}
export interface UserType {
    idUser: string,
    nameUser: string,
    img?: string,
    email?: string,
    phone?: string,
    created_at?: string,
    updated_at?: string,
    action?: string
}
export interface UserAddressType {
    idAddress: number,
    idUser: string,
    typeAddress: string,
    detail: string,
    nameUser: string
}
export interface PositionType {
    position_id?: number,
    idStaff?: string,
    position_name?: string
}
export interface StaffType extends PositionType {
    idStaff?: string,
    name: string,
    avatar?: string,
    email?: string,
    phone?: string,
    birthday?: string,
    address: string,
    created_at?: string,
    updated_at?: string,
    action?: string
}
export interface ShipperType {
    idStaff: string,
    position_name: string,
    name: string
}
export interface PostType {
    idPost: number,
    idType: number,
    nameType: string,
    title: string,
    thumbnails: string,
    dateAdded: string,
    poster: string,
    valuesPosts?: string
}
export interface CommentType {
    id: number,
    idUser: string,
    name: string,
    nameUser: string,
    img: string,
    created_date: string,
    value: string
}
export interface SaleDetailType {
    idSaleDetail: number,
    idProduct: number,
    idSale: number,
    discount: number,
    created_at?: Date
}
export interface SaleType {
    idSale: number,
    title: string,
    start_date: Date,
    end_date: Date,
}
export interface OrderType {
    idOrder: string,
    idUser: string,
    idShipper: string | null,
    created_at: string,
    fullName: string,
    phone: string,
    address: string,
    costs: number,
    method: string,
    edd: Date,
    paymentStatus: 'paid' | 'unpaid',
    orderStatus: string,
    note: string,
}
export interface OrderDetailType {
    idOrdDetail: number,
    idOrder: string,
    idProduct: number,
    nameProduct: string,
    imgProduct: string,
    countProduct: number,
    discount: number,
    price: number
}
export interface CategoryPostType {
    idType: number,
    nameType: string,
    create_at?: Date,
    update_at?: Date
}
export interface CategoryProductType {
    idType: number,
    nameType: string,
    image_url?:string,
    count?:number 
    detail: CategoryDetailType[]
}
export interface CategoryDetailType {
    idType?: number;
    id: string;
    type: string;
    name: string;
    displayname: string;
    datatypes: string;
    displayorder: number;
}

export interface WarehouseType {
    id: number,
    idProduct: number,
    idpersonIOX: string,
    dateIOX: Date,
    countProduct: number,
    statusWare: 'import' | 'export'
}