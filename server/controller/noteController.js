const noteService = require('../service/noteService');

const createNote = async (req, res) => {
    try {
        const note = req.body;
        note.user_id = req.user.id;
        console.log(req.body)
        const result = await noteService.createNote(note);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
}

const searchNotes = async (req, res) => {
    try {
        const notes = await noteService.searchNotes(req.user.id, req.query.search);
        res.status(200).json(notes);
    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
}

const getNotes = async (req, res) => {
    try {
        const notes = await noteService.getNotes(req.user.id);
        res.status(200).json(notes);
    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
}

const getArchivedNotes = async (req, res) => {
    try {
        const notes = await noteService.getArchivedNotes(req.user.id);
        res.status(200).json(notes);
    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
}

const getTrashedNotes = async (req, res) => {
    try {
        const notes = await noteService.getTrashedNotes(req.user.id);
        res.status(200).json(notes);
    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
}

const getReminderNotes = async (req, res) => {
    try {
        const notes = await noteService.getReminderNotes(req.user.id);
        res.status(200).json(notes);
    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
}

const getNote = async (req, res) => {
    try {
        const note = await noteService.getNote(req.params.id);
        res.status(200).json(note);
    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
}

const updateNote = async (req, res) => {
    try {
        const note = req.body;
        const result = await noteService.updateNote(req.params.id, note);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
}

const archiveNote = async (req, res) => {
    try {
        const result = await noteService.archiveNote(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
}

const unarchiveNote = async (req, res) => {
    try {
        const result = await noteService.unarchiveNote(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
}

const trashNote = async (req, res) => {
    try {
        const result = await noteService.trashNote(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
}

const restoreNote = async (req, res) => {
    try {
        const result = await noteService.restoreNote(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
}

const deleteNote = async (req, res) => {
    try {
        const result = await noteService.deleteNote(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
}

module.exports = { 
    createNote,
    searchNotes, 
    getNotes, 
    getArchivedNotes, 
    getTrashedNotes, 
    getReminderNotes,
    getNote, 
    updateNote, 
    archiveNote, 
    unarchiveNote, 
    trashNote, 
    restoreNote, 
    deleteNote 
};