import { UserType, UserAddressType } from "types/type";
import { create } from "zustand";

interface userStoreType {
    user: null | UserType[],
    setStoreUser: (user: Partial<UserType>) => void;
    updated_Store_User: (user: Partial<UserType>) => void;
    add_address: (address: Partial<UserAddressType>) => void;
    remove_address: (id: Partial<number>) => void;
    updated_address: (data: Partial<{ id?: number, detail?: string, typeAddress?: string }>) => void;
}

export const userStore = create<userStoreType>((set) => ({
    user: null,
    setStoreUser: (user) => set(() => ({ user: user as UserType[] })),
    updated_Store_User: (user) => set((state) => {
        const users = state.user && state.user.map((u: UserType) => ({ ...u, ...user }));
        return { user: users as UserType[] };
    }),
    add_address: (address) => set((state) => {
        const users = state.user && state.user.map((u: UserType) => ({
            ...u,
            address: [...u.address, address]
        }));
        return { user: users as UserType[] };
    }),
    remove_address: (id) => set((state) => {
        const users = state.user && state.user.map((u: UserType) => ({
            ...u,
            address: u.address.filter((a: UserAddressType) => a.idAddress !== id)
        }));
        return { user: users as UserType[] };
    }),
    updated_address: (data) => set((state) => {
        const users = state.user && state.user.map((u: UserType) => ({
            ...u,
            address: u.address.map((a: UserAddressType) => {
                return {
                    ...a,
                    detail: data.detail && a.idAddress === data.id ? data.detail : a.detail,
                    type: data.typeAddress ? (a.idAddress === data.id ? data.typeAddress : (a.type === "default" ? "extra" : a.type)) : a.type
                }
            })
        }));
        return { user: users as UserType[] };
    }),
}))