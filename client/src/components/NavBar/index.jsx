import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LuMenu } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { MdOutlineSearch } from "react-icons/md";
import Cookies from 'js-cookie';
import './style.css'

const NavBar = ({searchQuery, handleSearch}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);

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
                { Cookies.get('jwt_token') && 
                    <div className={`search-bar-con ${showSearchBar ? "mobile-search-bar-con" : ""}`}>
                        <MdOutlineSearch className="search-icon" />
                        <input type="search" placeholder="Search" className="search-bar" value={searchQuery} onChange={handleSearch} autoFocus onBlur={() => setShowSearchBar(false)} />
                    </div>
                }
                { Cookies.get('jwt_token') && 
                    !showSearchBar &&
                    (<button className="menu-button search-bar-btn" onClick={() => setShowSearchBar(!showSearchBar)}>
                        <MdOutlineSearch className="search-icon" />
                    </button>)
                }
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