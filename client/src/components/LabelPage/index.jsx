import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { IoSend, IoColorPalette} from "react-icons/io5";
import {MdOutlineArchive, MdLabelOutline, MdCancel, MdOutlineUnarchive} from "react-icons/md";
import toast from "react-hot-toast";
import CreatableSelect from 'react-select/creatable';
import { useParams } from "react-router-dom";
import Loader from "../Loader";
import NoNotes from "../NoNotes";
import Failure from "../Failure";
import LabelItem from "./LabelItem";

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

const LabelPage = () => {
    
    const [notesList, setNotesList] = useState([]);
    const [labelsList, setLabelsList] = useState([]);
    const [showTextArea, setShowTextArea] = useState(false);
    const [showBgColors, setShowBgColors] = useState(false);
    const [showLabels, setShowLabels] = useState(false);
    const [showEditNotePopup, setShowEditNotePopup] = useState(false);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
    const {label} = useParams();

    const [note, setNote] = useState({
        title: '',
        content: '',
        labels: [label],
        bg_color: '',
        archive: false
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

    const handleArchiveChange = (archive) => {
        setNote({
            ...note,
            archive: archive
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
        setNote({
            title: '',
            content: '',
            labels: [label],
            bg_color: ''
        });
    }, [label]);

    const fetchNotes = async () => {
        const url = process.env.REACT_APP_BACKEND_URL + `/api/labels/${label}/notes`;
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

    const saveNote = async () => {
        console.log(note);
        const url = process.env.REACT_APP_BACKEND_URL + '/api/notes';
        const options = {
            method: 'POST',
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
                toast.success('Note saved');
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
                <LabelItem key={index} note={note} trashNote={trashNote} archiveNote={archiveNote} openEditNotePopup={openEditNotePopup} handleColorUpdate={handleColorUpdate} />
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
            <div className="notes-input-container" style={{backgroundColor: note.bg_color ? note.bg_color : 'transparent'}} onClick={() => setShowTextArea(true)} onMouseLeave={() => setShowTextArea(false)}>
                <input type="text" className="notes-input" placeholder={`${showTextArea ? "Title" : "Take a note..."}`} name="title" value={note.title} onChange={handleNoteChange} />
                {showTextArea &&
                    <>
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
                        <div className="notes-options">
                            <div className="notes-option-con">
                                <button className="notes-option-btn" title="Background Colors" onMouseOver={() => setShowBgColors(true)}  onMouseOut={() => setShowBgColors(false)}>
                                    <IoColorPalette className="notes-option-icon" />
                                </button>
                                {showBgColors &&
                                    <div className="notes-colors" onMouseOver={() => setShowBgColors(true)}  onMouseOut={() => setShowBgColors(false)}>
                                        <button className="notes-color" style={{backgroundColor: "transparent"}} onClick={() => handleBgColorChange('')} >
                                            <MdCancel className="notes-color-icon" />
                                        </button>
                                        <button className="notes-color" style={{backgroundColor: '#f28b82'}} onClick={() => handleBgColorChange('#f28b82')} ></button>
                                        <button className="notes-color" style={{backgroundColor: '#fbbc04'}} onClick={() => handleBgColorChange('#fbbc04')} ></button>
                                        <button className="notes-color" style={{backgroundColor: '#fff475'}} onClick={() => handleBgColorChange('#fff475')} ></button>
                                        <button className="notes-color" style={{backgroundColor: '#ccff90'}} onClick={() => handleBgColorChange('#ccff90')} ></button>
                                        <button className="notes-color" style={{backgroundColor: '#a7ffeb'}} onClick={() => handleBgColorChange('#a7ffeb')} ></button>
                                    </div>
                                }
                            </div>
                            {/* <div className="notes-option-con">
                                <button className="notes-option-btn" title="Archive" onClick={note.archive ? () => handleArchiveChange(false) : () => handleArchiveChange(true)}>
                                    {note.archive ?
                                        <MdOutlineUnarchive className="notes-option-icon"/>
                                        :
                                        <MdOutlineArchive className="notes-option-icon"/>
                                    }
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
                        </div>
                        <button type="button" className="notes-save-button" onClick={saveNote}>
                            <IoSend className="notes-save-icon" />
                        </button>
                    </div>
                    </>
                }
            </div>
            {renderSwitch()}
            {showEditNotePopup && renderEditNotePopup(note)}
        </div>
    );
}

export default LabelPage;