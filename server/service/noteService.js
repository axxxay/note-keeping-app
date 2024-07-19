const {v4: uuidv4} = require('uuid');
const Note = require('../model/Note');
const {validateNote} = require('../utils/validation');
const { Op } = require('sequelize');

const createNote = async (note) => {
    try {
        validateNote(note);
        note.id = uuidv4();
        note.labels = note.labels ? note.labels.join(',') : '';
        await Note.create(note);
        return {success: "Note created successfully"}
    } catch (error) {
        console.error('Error creating note:', error);
        throw error;
    }
};

const searchNotes = async (userId, query) => {
    try {
        const notes = await Note.findAll({
            where: {
                user_id: userId,
                trashed: 0,
                [Op.or]: {
                    title: {
                        [Op.like]: `%${query}%`
                    },
                    content: {
                        [Op.like]: `%${query}%`
                    }
                }
            },
            order: [['created_at', 'DESC']]
        });
        notes.forEach(note => {
            note.labels = note.labels.split(',').map(label => label.trim());
        });
        return notes;
    } catch (error) {
        console.error('Error searching notes:', error);
        throw error;
    }
}

const getNotes = async (userId) => {
    try {
        const notes = await Note.findAll({
            where: {
                user_id: userId,
                trashed: 0,
                archived: 0
            },
            order: [['created_at', 'DESC']]
        });
        notes.forEach(note => {
            note.labels = note.labels.split(',').map(label => label.trim());
        });
        return notes;
    } catch (error) {
        console.error('Error getting notes:', error);
        throw error;
    }
}

const getArchivedNotes = async (userId) => {
    try {
        const notes = await Note.findAll({
            where: {
                user_id: userId,
                trashed: 0,
                archived: 1
            },
            order: [['created_at', 'DESC']]
        });
        notes.forEach(note => {
            note.labels = note.labels.split(',').map(label => label.trim());
        });
        return notes;
    } catch (error) {
        console.error('Error getting archived notes:', error);
        throw error;
    }
}

const getTrashedNotes = async (userId) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const notes = await Note.findAll({
            where: {
                user_id: userId,
                trashed: 1,
                trashed_at: {
                    [Op.gte]: thirtyDaysAgo
                }
            },
            order: [['created_at', 'DESC']]
        });
        notes.forEach(note => {
            note.labels = note.labels.split(',').map(label => label.trim());
        });
        return notes;
    } catch (error) {
        console.error('Error getting trashed notes:', error);
        throw error;
    }
}

const getNote = async (noteId) => {
    try {
        const note = await Note.findOne({
            where: {
                id: noteId
            }
        });
        if (!note) {
            const error = new Error('Note not found');
            error.statusCode = 404;
            throw error;
        }
        note.labels = note.labels.split(',').map(label => label.trim());
        return note;
    } catch (error) {
        console.error('Error getting note:', error);
        throw error;
    }
}

const updateNote = async (noteId, note) => {
    try {
        validateNote(note);
        await getNote(noteId);
        note.labels = note.labels ? note.labels.join(',') : '';
        result = await Note.update(note, {
            where: {
                id: noteId
            }
        });
        return {success: "Note updated successfully"};
    } catch (error) {
        console.error('Error updating note:', error);
        throw error;
    }
}

const archiveNote = async (noteId) => {
    try {
        await getNote(noteId);
        result = await Note.update({archived: 1}, {
            where: {
                id: noteId
            }
        });
        return {success: "Note archived successfully"};
    } catch (error) {
        console.error('Error archiving note:', error);
        throw error;
    }
}

const unarchiveNote = async (noteId) => {
    try {
        await getNote(noteId);
        result = await Note.update({archived: 0}, {
            where: {
                id: noteId
            }
        });
        return {success: "Note unarchived successfully"};
    } catch (error) {
        console.error('Error unarchiving note:', error);
        throw error;
    }
}

const trashNote = async (noteId) => {
    try {
        await getNote(noteId);
        result = await Note.update({
            trashed: 1,
            trashed_at: new Date()
        }, {
            where: {
                id: noteId
            }
        });
        return {success: "Note trashed successfully"};
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
}

const restoreNote = async (noteId) => {
    try {
        await getNote(noteId);
        result = await Note.update({
            trashed: 0,
            trashed_at: null
        }, {
            where: {
                id: noteId
            }
        });
        return {success: "Note restored successfully"};
    } catch (error) {
        console.error('Error restoring note:', error);
        throw error;
    }
}

const deleteNote = async (noteId) => {
    try {
        await getNote(noteId);
        result = await Note.destroy({
            where: {
                id: noteId
            }
        });
        return {success: "Note deleted successfully"};
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
}

module.exports = { 
    createNote, 
    searchNotes,
    getNotes, 
    getArchivedNotes, 
    getTrashedNotes, 
    getNote, 
    updateNote, 
    archiveNote, 
    unarchiveNote, 
    trashNote, 
    restoreNote, 
    deleteNote 
};
