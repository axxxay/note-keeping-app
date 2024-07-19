import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({element}) => {
    const jwtToken = Cookies.get('jwt_token')
    if(jwtToken === undefined){
        return <Navigate to='/' />
    }
    return element
}

export default ProtectedRoute