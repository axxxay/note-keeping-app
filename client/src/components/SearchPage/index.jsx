import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { IoSend, IoColorPalette} from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import {MdOutlineArchive, MdLabelOutline, MdCancel, MdEditNote} from "react-icons/md";
import toast from "react-hot-toast";
import SearchItem from "./SearchItem";
// import './style.css';

const SearchPage = ({search}) => {
    
    const [notesList, setNotesList] = useState([]);
    const [showEditNotePopup, setShowEditNotePopup] = useState(false);
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
        fetchNotes();
    }, [search]);

    const fetchNotes = async () => {
        const url = process.env.REACT_APP_BACKEND_URL + '/api/notes/search?search=' + search;
        const options = {
            method: 'GET',
            headers: {
                contentType: 'application/json',
                'Authorization': `Bearer ${Cookies.get('jwt_token')}`
            }
        }
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (response.ok) {
                console.log(data)
                setNotesList(data);
            } else {
                console.log(data.error);
                toast.error(data.error);
            }
        } catch (error) {
            console.log(error);
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
                fetchNotes();
                toast.success('Note deleted');
            } else {
                console.log(data.error);
                toast.error(data.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const archiveNote = async (id) => {
        const url = process.env.REACT_APP_BACKEND_URL + `/api/notes/${id}/archive`;
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
                fetchNotes();
                toast.success('Note archived');
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
                fetchNotes();
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
                fetchNotes();
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

    return (
        <div className="notes-page-container">
            <h1 className="notes-page-title">Search</h1>
            <div className="notes-list-container">
                {notesList.map((note, index) => (
                    <SearchItem key={index} note={note} trashNote={trashNote} archiveNote={archiveNote} unarchiveNote={unarchiveNote} openEditNotePopup={openEditNotePopup} handleColorUpdate={handleColorUpdate} />
                ))}
            </div>
            {showEditNotePopup && renderEditNotePopup(note)}
        </div>
    );
}

export default SearchPage;