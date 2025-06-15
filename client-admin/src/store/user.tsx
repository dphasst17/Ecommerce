import { create } from "zustand";
import { StaffType, UserAddressType, UserType } from "../types/types";

interface UserStoreType {
    user: UserType[] | null;
    staff: StaffType[] | null;
    currentUser: StaffType[] | null;
    address: UserAddressType[] | null;
    setUser: (user: UserType[]) => void;
    setStaff: (staff: StaffType[]) => void;
    setCurrentUser: (currentUser: StaffType[]) => void;
    setAddress: (address: UserAddressType[]) => void;
}

export const userStore = create<UserStoreType>((set: any) => ({
    user: null,
    staff: null,
    currentUser: null,
    address: null,
    setUser: (user: UserType[]) => set({ user }),
    setStaff: (staff: StaffType[]) => set({ staff }),
    setCurrentUser: (currentUser: StaffType[]) => set({ currentUser }),
    setAddress: (address: UserAddressType[]) => set({ address }),
}));