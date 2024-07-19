import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { IoSend, IoColorPalette} from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import {MdOutlineArchive, MdLabelOutline, MdCancel, MdEditNote} from "react-icons/md";
import CreatableSelect from 'react-select/creatable';
import toast from "react-hot-toast";
import SearchItem from "./SearchItem";
import Loader from "../Loader";
import NoNotes from "../NoNotes";
import Failure from "../Failure";

const apiStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE'
}

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        border: '1px solid #433D8B',
        borderRadius: '5px',
        boxShadow: null,
        '&:hover': {
            borderColor: '#433D8B',
        },
        marginBottom: '0px',
        width: '100%!important',
        height: '30px',
        minHeight: '30px',
        fontSize: '13px'
    }),
    menu: (provided, state) => ({
        ...provided,
        marginTop: '0px',
        paddingTop: '0px',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: '#433D8B',
        '&:hover': {
            color: '#433D8B',
        },
        width: '15px',
        padding: '0px',
        margin: '0px',
        border: '0px',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#433D8B' : null,
        color: state.isSelected ? 'white' : 'black',
    }),
};

const SearchPage = ({search}) => {
    
    const [notesList, setNotesList] = useState([]);
    const [labelsList, setLabelsList] = useState([]);
    const [showEditNotePopup, setShowEditNotePopup] = useState(false);
    const [showLabels, setShowLabels] = useState(false);
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

    const handleLabelChange = (newValue) => {
        if(newValue !== null) {
            if(newValue.__isNew__) {
                addLabel(newValue.label);
            } else {
                if(note.labels.filter(label => label === newValue.label).length === 0 && note.labels.length < 9) {
                    setNote({
                        ...note,
                        labels: [...note.labels, newValue.label]
                    });
                }
            }
        } else {
            setNote({
                ...note,
                labels: note.labels
            });
        }
    };

    useEffect(() => {
        fetchNotes();
        fetchLabels();
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
                const labels = data.map(label => ({value: label.name, label: label.name}));
                setLabelsList(labels);
            } else {
                console.log(data.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const addLabel = async (label) => {
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
                if(note.labels.length < 9) {
                    setNote({
                        ...note,
                        labels: [...note.labels, label]
                    });
                }
                toast.success('Label added');
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
                <div className="notes-labels-container">
                    {note.labels.map((label, index) => (
                        <div key={index} className="notes-label">
                            <span>{label}</span>
                            <MdCancel className="notes-label-icon" onClick={() => setNote({
                                ...note,
                                labels: note.labels.filter((l, i) => i !== index)
                            })} />
                        </div>
                    ))}
                </div>
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
                    <div className="notes-option-con">
                        <button className="notes-option-btn" title="Add Labels" onMouseOver={() => setShowLabels(true)}  onMouseOut={() => setShowLabels(false)}>
                            <MdLabelOutline className="notes-option-icon" />
                        </button>
                        {showLabels &&
                            <div className="notes-colors" onMouseOver={() => setShowLabels(true)}  onMouseOut={() => setShowLabels(false)}>
                                <CreatableSelect
                                    isClearable
                                    onChange={handleLabelChange}
                                    options={labelsList}
                                    placeholder="Select Company"
                                    styles={customStyles}
                                />
                            </div>
                        }
                    </div>
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
                    <SearchItem key={index} note={note} trashNote={trashNote} archiveNote={archiveNote} unarchiveNote={unarchiveNote} openEditNotePopup={openEditNotePopup} handleColorUpdate={handleColorUpdate} />
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
                return <Failure fetchNotes={fetchNotes} />
            default:
                return null;
        }
    }

    return (
        <div className="notes-page-container">
            <h1 className="notes-page-title">Search</h1>
            {renderSwitch()}
            {showEditNotePopup && renderEditNotePopup(note)}
        </div>
    );
}

export default SearchPage;