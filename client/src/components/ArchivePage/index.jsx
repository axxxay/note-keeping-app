import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import toast from "react-hot-toast";
import ArchiveItem from "./ArchiveItem";
import NoNotes from "../NoNotes";
import Loader from "../Loader";
import Failure from "../Failure";
import EditNotePopup from "../EditNotePopup";
import { addLabel, editNote } from "../APIs";
import './style.css';

const apiStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE'
}


const ArchivePage = () => {
    
    const [notesList, setNotesList] = useState([]);
    const [labelsList, setLabelsList] = useState([]);
    const [showEditNotePopup, setShowEditNotePopup] = useState(false);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
    const [note, setNote] = useState({
        title: '',
        content: '',
        labels: [],
        bg_color: '',
        reminder_date: null
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
        fetchArchiveNotes();
        fetchLabels();
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
        await editNote(note, setNote, fetchArchiveNotes, setShowEditNotePopup);
    }


    const renderEditNotePopup = (note) => (
        <EditNotePopup 
            note={note} 
            setNote={setNote}
            closeEditNotePopup={closeEditNotePopup}
            handleNoteChange={handleNoteChange} 
            handleLabelChange={handleLabelChange} 
            labelsList={labelsList}
            fetchNotes={fetchArchiveNotes}
            setShowEditNotePopup={setShowEditNotePopup}
        />
    )

    const renderNotesList = () => (
        notesList.length !== 0 ? 
        <div className="notes-list-container">
            {notesList.map((note, index) => (
                <ArchiveItem key={index} note={note} fetchNotes={fetchArchiveNotes} openEditNotePopup={openEditNotePopup} handleColorUpdate={handleColorUpdate} />
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