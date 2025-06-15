import { useLocation } from "react-router-dom";
import Auth from "../pages/auth";
import AdminLayout from "./AdminLayout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return location.pathname !== "/auth" ? (
    <AdminLayout>{children}</AdminLayout>
  ) : (
    <Auth />
  );
};

export default Layout;
