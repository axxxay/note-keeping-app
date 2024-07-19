import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { IoSend, IoColorPalette} from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import {MdOutlineArchive, MdLabelOutline, MdCancel, MdEditNote} from "react-icons/md";
import toast from "react-hot-toast";
import ArchiveItem from "./ArchiveItem";
import './style.css';
import NoNotes from "../NoNotes";
import Loader from "../Loader";
import Failure from "../Failure";

const apiStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE'
}

const ArchivePage = () => {
    
    const [notesList, setNotesList] = useState([]);
    const [showEditNotePopup, setShowEditNotePopup] = useState(false);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
    const [note, setNote] = useState({
        title: '',
        content: '',
        labels: [],
        bg_color: ''
    });

    const handleNoteChange = (e) => {
        setNote({
            ...note,
            [e.target.name]: e.target.value
        });
    }

    const handleBgColorChange = (color) => {
        setNote({
            ...note,
            bg_color: color
        });
    }

    const openEditNotePopup = (note) => {
        setNote(note);
        setShowEditNotePopup(true);
    }

    const closeEditNotePopup = () => {
        setNote({
            title: '',
            content: '',
            labels: [],
            bg_color: ''
        });
        setShowEditNotePopup(false);
    }

    useEffect(() => {
        fetchArchiveNotes();
    }, []);

    const fetchArchiveNotes = async () => {
        const url = process.env.REACT_APP_BACKEND_URL + '/api/notes/archived';
        const options = {
            method: 'GET',
            headers: {
                contentType: 'application/json',
                'Authorization': `Bearer ${Cookies.get('jwt_token')}`
            }
        }
        try {
            setApiStatus(apiStatusConstants.inProgress);
            const response = await fetch(url, options);
            const data = await response.json();
            if (response.ok) {
                console.log(data)
                setNotesList(data);
                setApiStatus(apiStatusConstants.success);
            } else {
                console.log(data.error);
                toast.error(data.error);
                setApiStatus(apiStatusConstants.failure);
            }
        } catch (error) {
            console.log(error);
            setApiStatus(apiStatusConstants.failure);
        }
    }

    const trashNote = async (id) => {
        const url = process.env.REACT_APP_BACKEND_URL + `/api/notes/${id}/trash`;
        const options = {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json',
                Authorization: `Bearer ${Cookies.get('jwt_token')}`
            }
        }
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (response.ok) {
                console.log(data)
                fetchArchiveNotes();
                toast.success('Note deleted');
            } else {
                console.log(data.error);
                toast.error(data.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const unarchiveNote = async (id) => {
        const url = process.env.REACT_APP_BACKEND_URL + `/api/notes/${id}/unarchive`;
        const options = {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json',
                Authorization: `Bearer ${Cookies.get('jwt_token')}`
            }
        }
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (response.ok) {
                console.log(data)
                fetchArchiveNotes();
                toast.success('Note unarchived');
            } else {
                console.log(data.error);
                toast.error(data.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const editNote = async (note) => {
        const url = process.env.REACT_APP_BACKEND_URL + `/api/notes/${note.id}`;
        const options = {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json',
                Authorization: `Bearer ${Cookies.get('jwt_token')}`
            },
            body: JSON.stringify(note)
            
        }
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (response.ok) {
                console.log(data)
                setNote({
                    title: '',
                    content: '',
                    labels: [],
                    bg_color: ''
                });
                fetchArchiveNotes();
                toast.success('Note updated');
                setShowEditNotePopup(false);
            } else {
                console.log(data.error);
                toast.error(data.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleColorUpdate = async (note, color) => {
        console.log(note, color);
        note.bg_color = color;
        await editNote(note);
    }

    const renderEditNotePopup = (note) => (
        <div className="notes-update-popup-container">
            <div className="notes-update-popup-overlay" onClick={closeEditNotePopup}></div>
            <div className="notes-input-container" style={{backgroundColor: note.bg_color ? note.bg_color : '#17153B'}}>
                <input type="text" className="notes-input" placeholder="Title" name="title" value={note.title} onChange={handleNoteChange} />
                <textarea className="notes-textarea" placeholder="Take a note..." name="content" value={note.content} onChange={handleNoteChange} />
                <div className="notes-options-container">
                    {/* <div>
                        <button className="edit-note-option-btn">
                            <MdOutlineArchive className="edit-note-option-icon" />
                        </button>
                        <button className="edit-note-option-btn">
                            <RiDeleteBin6Line className="edit-note-option-icon" />
                        </button>
                        <button className="edit-note-option-btn">
                            <MdLabelOutline className="edit-note-option-icon" />
                        </button>
                        <button className="edit-note-option-btn">
                            <IoColorPalette className="edit-note-option-icon" />
                        </button>
                    </div> */}
                    <button type="button" className="notes-save-button" style={{marginLeft: 'auto'}} onClick={() => editNote(note)}>
                        <IoSend className="notes-save-icon" />
                    </button>
                </div>
            </div>
        </div>
    )

    const renderNotesList = () => (
        notesList.length !== 0 ? 
        <div className="notes-list-container">
            {notesList.map((note, index) => (
                <ArchiveItem key={index} note={note} trashNote={trashNote} unarchiveNote={unarchiveNote} openEditNotePopup={openEditNotePopup} handleColorUpdate={handleColorUpdate} />
            ))}
        </div>
        :
        <NoNotes />
    )

    const renderSwitch = () => {
        switch (apiStatus) {
            case apiStatusConstants.inProgress:
                return <Loader />
            case apiStatusConstants.success:
                return renderNotesList();
            case apiStatusConstants.failure:
                return <Failure fetchNotes={fetchArchiveNotes} />
            default:
                return null;
        }
    }

    return (
        <div className="notes-page-container">
            <h1 className="notes-page-title">Archive</h1>
            {renderSwitch()}
            {showEditNotePopup && renderEditNotePopup(note)}
        </div>
    );
}

export default ArchivePage;