import { create } from "zustand";
import { CategoryProductType, ProductResponse } from "../types/types";

interface ProductStoreType {
  product: ProductResponse | null;
  category: CategoryProductType[] | null;
  setProduct: (product: ProductResponse) => void;
  setCategory: (product: CategoryProductType[]) => void;
  error: string | null;
  setError: (error: string | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const productStore = create<ProductStoreType>((set: any) => ({
  product: null,
  category: null,
  setProduct: (product: ProductResponse) => set({ product }),
  setCategory: (category: CategoryProductType[]) => set({ category }),
  error: null,
  setError: (error: string | null) => set({ error }),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));


