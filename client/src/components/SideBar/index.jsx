import { MdOutlineLightbulb, MdOutlineArchive, MdLabelOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import './style.css';

const SideBar = ({setSearchQuery, showSideBar, setShowSideBar}) => {

    const location = useLocation();
    const path = location.pathname;
    const [activeTab, setActiveTab] = useState(path.slice(1) || 'notes');
    const [labelsList, setLabelsList] = useState([]);

    useEffect(() => {
        if(path.slice(1) !== 'search') {
            setActiveTab(path.split('/')[path.split('/').length - 1]);
        }
    }, [path]);

    useEffect(() => {
        fetchLabels();
    }, []);

    const fetchLabels = async () => {
        const url = process.env.REACT_APP_BACKEND_URL + '/api/labels';
        const options = {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
                Authorization: `Bearer ${Cookies.get('jwt_token')}`
            },
        }
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (response.ok) {
                console.log(data)
                setLabelsList(data);
            } else {
                console.log(data.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onClickTab = (tab) => {
        setSearchQuery('');
        setActiveTab(tab);
        if (showSideBar) {
            setShowSideBar(false);
        }
    }

    return (
        <>
        <div className={` ${showSideBar ? "sidebar-overlay" : ""}`} onClick={() => setShowSideBar(false)}></div>
        <div className={`sidebar-container ${showSideBar ? "sidebar-mobile-container" : ""}`}>
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
            {labelsList.map((label, index) => (
                <Link to={`/label/${label.name}`} key={index} className={`sidebar-item ${activeTab === label.name ? "active-sidebar-item" : ""}`} onClick={() => onClickTab(label.name)} >
                    <MdLabelOutline className="sidebar-icon" />
                    <p className="sidebar-item-text">{label.name}</p>
                </Link>
            ))}
        </div>
        </>
    );
}

export default SideBar;