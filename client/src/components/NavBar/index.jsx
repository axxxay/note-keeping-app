import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LuMenu } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import Cookies from 'js-cookie';
import './style.css'

const NavBar = () => {
    const [showMenu, setShowMenu] = useState(false);

    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('jwt_token');
        navigate('/', { replace: true });
        window.location.reload();
    }

    return (
        <>
            <nav className="navbar-container">
                <Link to="/" className="navbar-logo">Keep Notes</Link>
                <button className="menu-button" onClick={() => setShowMenu(!showMenu)}>
                    {showMenu ? <IoClose className="menu-icon" /> :
                        <LuMenu className="menu-icon" />
                    }
                </button>
                {
                    Cookies.get('jwt_token') && <button className="logout-button" onClick={handleLogout}>Logout</button>
                }
                
            </nav>
            {
                showMenu && (
                    <div className="menu-container">
                        {
                            Cookies.get('jwt_token') && <button className="menu-logout-button" onClick={handleLogout}>Logout</button>
                        }
                    </div>
                )
            }
        </>
    );
};

export default NavBar;