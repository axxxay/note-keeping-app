import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import toast from "react-hot-toast";
import TrashItem from "./TrashItem";

const TrashPage = () => {
    
    const [notesList, setNotesList] = useState([]);

    useEffect(() => {
        fetchTrashNotes();
    }, []);

    const fetchTrashNotes = async () => {
        const url = process.env.REACT_APP_BACKEND_URL + '/api/notes/trashed';
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

    const restoreNote = async (id) => {
        const url = process.env.REACT_APP_BACKEND_URL + `/api/notes/${id}/restore`;
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
                fetchTrashNotes();
                toast.success('Note Restored');
            } else {
                console.log(data.error);
                toast.error(data.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteNote = async (id) => {
        const url = process.env.REACT_APP_BACKEND_URL + `/api/notes/${id}/`;
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
            if (response.ok) {
                console.log(data)
                fetchTrashNotes();
                toast.success('Note Deleted');
            } else {
                console.log(data.error);
                toast.error(data.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="notes-page-container">
            <h1 className="notes-page-title">Recycle Bin</h1>
            <div className="notes-list-container">
                {notesList.map((note, index) => (
                    <TrashItem key={index} note={note} restoreNote={restoreNote} deleteNote={deleteNote} />
                ))}
            </div>
        </div>
    );
}

export default TrashPage;