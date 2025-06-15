import { StatusValueType } from "../types/types"

export const pagination = (itemsInPage: number, dataLength: number) => {
    return Math.ceil(dataLength / itemsInPage)
}
export const percentDiscount = (discount: number, price: number) => {
    return price - ((price * discount) / 100)
}
export const formatDate = (date: string) => {
    return date.split("T")[0].split("-").reverse().join("/")
}
export const statusNextValue: StatusValueType[] = [
    {
        current: "pending",
        next: "prepare",
    },
    {
        current: "prepare",
        next: "shipping",
    }
]
export const ShipperNextValue: StatusValueType[] = [
    {
        current: "shipping",
        next: "delivery",
    },
    {
        current: "delivery",
        next: "success",
    },
    {
        current: "delivery",
        next: "failed",
    }
]
export const CalculatePercentLastMonth = (current: number, previous: number): number => {
    if (previous === 0) {
      if (current === 0) return 0; 
      return 100; 
    }
    return ((current - previous) / previous) * 100;
  };
  
export const FormatPercentChange = (current: number, previous: number): string => {
    const percent = CalculatePercentLastMonth(current, previous);
    const rounded = Math.abs(percent).toFixed(1);
    return `${percent >= 0 ? '+' : '-'}${rounded}%`;
  };
  