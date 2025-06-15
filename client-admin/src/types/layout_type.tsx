export interface Product_sold_type {
    idProduct: number;
    nameProduct: string;
    imgProduct: string;
    total_count: number;
    price: number;
    [x: string]: string | number
}
export interface Product_view_type {
    nameProduct: string;
    imgProduct: string;
    view: number;
    price: number;
    [x: string]: string | number
}