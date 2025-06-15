export const setLocalStorage = (key: string, value: any) => {
    return localStorage.setItem(key, JSON.stringify(value));
}

export const getLocalStorage = (key: string) => {
    return JSON.parse(localStorage.getItem(key) || 'false');
}
export const removeLocalStorage = (key: string) => {
    return localStorage.removeItem(key);
}