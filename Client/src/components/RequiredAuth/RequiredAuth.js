import { Navigate, useLocation } from 'react-router-dom';
import Home from '../Home';

export default function RequiredAuth({ children }) {
    const location = useLocation();
    return (
        // (
        //     sessionStorage.getItem("user") == null || sessionStorage.getItem("user") == undefined
        // )
        //     ?
        //     <Navigate to="/" state={{ from: location }} />
        //     : (
                <Home children={children} />
           // )
    )
}