import { MdOutlineLightbulb, MdOutlineArchive, MdLabelOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import './style.css';
import { useEffect, useState } from "react";

const SideBar = ({setSearchQuery}) => {

    const location = useLocation();
    const path = location.pathname;
    const [activeTab, setActiveTab] = useState(path.slice(1) || 'notes');

    useEffect(() => {
        if(path.slice(1) !== 'search') {
            setActiveTab(path.slice(1));
        }
    }, [path]);

    const onClickTab = (tab) => {
        setSearchQuery('');
        setActiveTab(tab);
    }

    return (
        <div className="sidebar-container">
            <Link to="/notes" className={`sidebar-item ${activeTab === 'notes' ? "active-sidebar-item" : ""}`} onClick={() => onClickTab('notes')} >
                <MdOutlineLightbulb className="sidebar-icon" />
                <p className="sidebar-item-text">Notes</p>
            </Link>
            <Link to="/archive" className={`sidebar-item ${activeTab === 'archive' ? "active-sidebar-item" : ""}`} onClick={() => onClickTab('archive')} >
                <MdOutlineArchive className="sidebar-icon" />
                <p className="sidebar-item-text">Archive</p>
            </Link>
            <Link to="/bin" className={`sidebar-item ${activeTab === 'bin' ? "active-sidebar-item" : ""}`} onClick={() => onClickTab('bin')} >
                <RiDeleteBin6Line className="sidebar-icon" />
                <p className="sidebar-item-text">Bin</p>
            </Link>
            <Link to="/" className={`sidebar-item ${activeTab === 'some' ? "active-sidebar-item" : ""}`} onClick={() => onClickTab('some')} >
                <MdLabelOutline className="sidebar-icon" />
                <p className="sidebar-item-text">Some</p>
            </Link>
        </div>
    );
}

export default SideBar;