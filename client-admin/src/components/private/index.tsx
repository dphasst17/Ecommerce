import { Navigate, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { StateContext } from '../../context/state';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { isLogin, position } = useContext(StateContext);
    const navigate = useNavigate()
    useEffect(() => {
        isLogin && position === "shipper" && navigate("/order")
    }, [isLogin, position])
    return isLogin ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;