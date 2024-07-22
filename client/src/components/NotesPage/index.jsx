import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import toast from "react-hot-toast";
import NoteItem from "./NoteItem";
import Loader from "../Loader";
import NoNotes from "../NoNotes";
import Failure from "../Failure";
import EditNotePopup from "../EditNotePopup";
import NoteInput from "../NoteInput";
import { addLabel, editNote } from "../APIs";
import './style.css';

const apiStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE'
}

const NotesPage = () => {
    
    const [notesList, setNotesList] = useState([]);
    const [labelsList, setLabelsList] = useState([]);
    const [showEditNotePopup, setShowEditNotePopup] = useState(false);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
    const [note, setNote] = useState({
        title: '',
        content: '',
        labels: [],
        bg_color: '',
        archive: false,
        reminder_date: null
    });

    const handleNoteChange = (e) => {
        setNote({
            ...note,
            [e.target.name]: e.target.value
        });
    }

    const handleContentChange = (content) => {
        setNote({
            ...note,
            content: content
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
            bg_color: '',
            reminder_date: null
        });
        setShowEditNotePopup(false);
    }

    const handleLabelChange = (newValue) => {
        if(newValue !== null) {
            if(newValue.__isNew__) {
                addLabel(newValue.label, fetchLabels, setNote, note);
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
    }, []);

    const fetchNotes = async () => {
        const url = process.env.REACT_APP_BACKEND_URL + '/api/notes';
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


    const handleColorUpdate = async (note, color) => {
        note.bg_color = color;
        await editNote(note, setNote, fetchNotes, setShowEditNotePopup);
    }

    const renderEditNotePopup = (note) => (
        <EditNotePopup 
            note={note} 
            setNote={setNote}
            closeEditNotePopup={closeEditNotePopup} 
            handleNoteChange={handleNoteChange} 
            handleLabelChange={handleLabelChange} 
            labelsList={labelsList}
            fetchNotes={fetchNotes}
            setShowEditNotePopup={setShowEditNotePopup}
            handleContentChange={handleContentChange}
        />
    )

    const renderNotesList = () => (
        notesList.length !== 0 ? 
        <div className="notes-list-container">
            {notesList.map((note, index) => (
                <NoteItem key={index} note={note} fetchNotes={fetchNotes} openEditNotePopup={openEditNotePopup} handleColorUpdate={handleColorUpdate} />
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
            <NoteInput 
                note={note} 
                setNote={setNote} 
                fetchNotes={fetchNotes}
                handleNoteChange={handleNoteChange} 
                labelsList={labelsList}
                handleLabelChange={handleLabelChange}
                handleBgColorChange={handleBgColorChange}
                handleContentChange={handleContentChange}
            />
            {renderSwitch()}
            {showEditNotePopup && renderEditNotePopup(note)}
        </div>
    );
}

export default NotesPage;