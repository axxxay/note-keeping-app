import { MdOutlineLightbulb, MdOutlineArchive, MdLabelOutline, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { IoCheckmarkOutline } from "react-icons/io5";
import { CgBell } from "react-icons/cg";
import { IoMdAdd } from "react-icons/io";
import { RotatingLines } from 'react-loader-spinner'
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import SideBarItem from "./SideBarItem";
import toast from "react-hot-toast";
import './style.css';

const SideBar = ({setSearchQuery, showSideBar, setShowSideBar}) => {

    const location = useLocation();
    const path = location.pathname;
    const [activeTab, setActiveTab] = useState(path.slice(1) || 'notes');
    const [labelsList, setLabelsList] = useState([]);
    const [label, setLabel] = useState('');
    const [showLabelPopup, setShowLabelPopup] = useState(false);
    const [loader, setLoader] = useState(false);

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
        setLoader(true);
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
        setLoader(false);
    }

    const addLabel = async () => {
        if (label.trim().length === 0) {
            toast.error('Label name cannot be empty');
            return;
        }
        const url = process.env.REACT_APP_BACKEND_URL + '/api/labels';
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                Authorization: `Bearer ${Cookies.get('jwt_token')}`
            },
            body: JSON.stringify({name: label})
        }
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (response.ok) {
                console.log(data)
                fetchLabels();
                toast.success('Label added');
                setLabel('');
            } else {
                console.log(data.error);
                toast.error(data.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const updateLabel = async (label) => {
        if(label.name.trim().length === 0) {
            toast.error('Label name cannot be empty');
            return;
        }

        const l1 = labelsList.find(l => l.id === label.id);
        if(l1.name === label.name) {
            return;
        }
        console.log('label', label);
        const url = process.env.REACT_APP_BACKEND_URL + `/api/labels/${label.id}`;
        const options = {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json',
                Authorization: `Bearer ${Cookies.get('jwt_token')}`
            },
            body: JSON.stringify({name: label.name})
        }

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                console.log(data);
                fetchLabels();
                toast.success('Label updated, refresh the page to see changes');
            } else {
                console.log(data.error);
                toast.error(data.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteLabel = async (labelId) => {
        const url = process.env.REACT_APP_BACKEND_URL + `/api/labels/${labelId}`;
        const options = {
            method: 'DELETE',
            headers: {
                "Content-Type": 'application/json',
                Authorization: `Bearer ${Cookies.get('jwt_token')}`
            }
        }

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                console.log(data);
                fetchLabels();
                toast.success('Label deleted, refresh the page to see changes');
            } else {
                console.log(data.error);
                toast.error(data.error);
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

    const renderLabelPopup = () => {
        return (
            <div className="label-popup-container">
                <div className="label-popup-overlay" onClick={() => setShowLabelPopup(false)}></div>
                <div className="label-popup">
                    <h3 className="label-popup-heading">Edit labels</h3>
                    <div className="label-popup-input-con">
                        <IoMdAdd className="checkmark-icon" />
                        <input type="text" placeholder="Create new label" style={{borderBottom: "1px solid #C8ACD6"}} className="label-popup-input" value={label} onChange={(e) => setLabel(e.target.value)} />
                        <button className="label-create-btn" onClick={addLabel}>
                            <IoCheckmarkOutline className="checkmark-icon" />
                        </button>
                    </div>
                    <div className="label-popup-list">
                        {labelsList.map((label) => (
                            <SideBarItem key={label.id} label={label} updateLabel={updateLabel} deleteLabel={deleteLabel} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className={` ${showSideBar ? "sidebar-overlay" : ""}`} onClick={() => setShowSideBar(false)}></div>
        <div className={`sidebar-container ${showSideBar && window.innerWidth <= 768 ? "sidebar-mobile-container" : ""}`}>
            <Link to="/notes" className={`sidebar-item ${activeTab === 'notes' ? "active-sidebar-item" : ""}`} onClick={() => onClickTab('notes')} >
                <MdOutlineLightbulb className="sidebar-icon" />
                <p className="sidebar-item-text">Notes</p>
            </Link>
            <Link to="/reminder" className={`sidebar-item ${activeTab === 'reminder' ? "active-sidebar-item" : ""}`} onClick={() => onClickTab('reminder')} >
                <CgBell className="sidebar-icon" />
                <p className="sidebar-item-text">Reminders</p>
            </Link>
            <Link to="/archive" className={`sidebar-item ${activeTab === 'archive' ? "active-sidebar-item" : ""}`} onClick={() => onClickTab('archive')} >
                <MdOutlineArchive className="sidebar-icon" />
                <p className="sidebar-item-text">Archive</p>
            </Link>
            <Link to="/bin" className={`sidebar-item ${activeTab === 'bin' ? "active-sidebar-item" : ""}`} onClick={() => onClickTab('bin')} >
                <RiDeleteBin6Line className="sidebar-icon" />
                <p className="sidebar-item-text">Bin</p>
            </Link>
            <button className="sidebar-item sidebar-item-btn" onClick={() => {setShowLabelPopup(true); setShowSideBar(false)}}>
                <MdOutlineEdit className="sidebar-icon" />
                <p className="sidebar-item-text">Edit labels</p>
            </button>
            {loader ?
                <div className="sidebar-loader-con">
                    <RotatingLines
                        visible={true}
                        height="35"
                        width="35"
                        color="#dec4eb"
                        strokeColor="#dec4eb"
                        strokeWidth="5"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                </div>
                :
                labelsList.map((label) => (
                    <Link to={`/label/${label.name}`} key={label.id} className={`sidebar-item ${activeTab === label.name ? "active-sidebar-item" : ""}`} onClick={() => onClickTab(label.name)} >
                        <MdLabelOutline className="sidebar-icon" />
                        <p className="sidebar-item-text">{label.name}</p>
                    </Link>
                ))
            }
        </div>
        {showLabelPopup && renderLabelPopup()}
        </>
    );
}

export default SideBar;