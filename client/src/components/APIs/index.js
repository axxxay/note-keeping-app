import toast from "react-hot-toast";
import Cookies from 'js-cookie';


export const archiveNote = async (id, fetchNotes) => {
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

export const unarchiveNote = async (id, fetchNotes) => {
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

export const trashNote = async (id, fetchNotes) => {
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

export const addLabel = async (label, fetchLabels, setNote, note) => {
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

export const saveNote = async (note, setNote, fetchNotes) => {
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
                bg_color: '',
                reminder_date: null
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

export const editNote = async (note, setNote, fetchNotes, setShowEditNotePopup) => {
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
                bg_color: '',
                reminder_date: null
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