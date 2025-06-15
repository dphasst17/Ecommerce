import Auth from "../pages/auth";
import Dashboard from "../pages/dashboard";
import Order from "../pages/order";
import Post from "../pages/post";
import Product from "../pages/product";
import Account from "../pages/account";
import Event from "../pages/event";
import Comment from "../pages/comment";


const publicRoutes: any = [
    { path: "/auth", component: Auth },
];
const privateRoutes: any = [
    { path: "/", component: Dashboard },
    { path: "/order", component: Order },
    { path: "/product", component: Product },
    { path: "/account", component: Account },
    { path: "/event", component: Event },
    { path: "/post", component: Post },
    { path: "/comment", component: Comment }

]
export { publicRoutes, privateRoutes };