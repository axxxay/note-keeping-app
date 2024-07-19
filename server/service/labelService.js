const {v4: uuidv4} = require('uuid');
const Label = require('../model/Label');
const Note = require('../model/Note');
const {validateLabel} = require('../utils/validation');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

const getLabels = async (userId) => {
    try {
        const labels = await Label.findAll({
            where: { user_id: userId },
            order: [['name', 'ASC']]
        });
        return labels;
    } catch (error) {
        console.error('Error getting labels:', error);
        throw error;
    }
}

const getLabel = async (labelId, userId) => {
    try {
        const label = await Label.findByPk(labelId, { where: { user_id: userId } });
        if (!label) {
            const error = new Error('Label not found');
            error.statusCode = 404;
            throw error;
        }
        return label;
    } catch (error) {
        console.error('Error getting label:', error);
        throw error;
    }
}

const getLabelByName = async (labelName, userId) => {
    try {
        const label = await Label.findOne({ where: { name: labelName, user_id: userId } });
        return label;
    } catch (error) {
        console.error('Error getting label by name:', error);
        throw error;
    }
}

const createLabel = async (label) => {
    try {
        validateLabel(label);
        const existingLabel = await getLabelByName(label.name, label.user_id);
        if (existingLabel) {
            const error = new Error('Label already exists');
            error.statusCode = 400;
            throw error;
        }
        console.log('Triggered');
        label.id = uuidv4();
        await Label.create(label);
        return {success: "Label created successfully"}
    } catch (error) {
        console.error('Error creating label:', error);
        throw error;
    }
}

const updateNoteLabels = async (oldLabel, label, userId) => {
    try {
        const notes = await Note.findAll({
            where: {
                labels: {
                    [Op.like]: `%${oldLabel}%`
                },
                user_id: userId
            },
        });
        for (const note of notes) {
            note.labels = note.labels.split(',').map(l => l.trim());
            const index = note.labels.indexOf(oldLabel);
            if (index !== -1) {
                note.labels[index] = label;
                await Note.update({ labels: note.labels.join(',') }, { where: { id: note.id, user_id: userId } });
            }
        }
        return {success: "Note labels updated successfully"}
    } catch (error) {
        console.error('Error updating note labels:', error);
        throw error;
    }

}

const updateLabel = async (labelId, label, userId) => {
    let transaction;
    try {
        validateLabel(label);
        await getLabel(labelId, userId);
        const existingLabel = await getLabelByName(label.name, userId);
        if (existingLabel) {
            const error = new Error('Label already exists');
            error.statusCode = 400;
            throw error;
        }

        // transaction = await sequelize.transaction(); // Start a transaction
        await Label.update({name: label.name}, {
                where: {
                    id: labelId,
                    user_id: userId
                },
            });
        await updateNoteLabels(label.oldLabel, label.name, userId);
        // await transaction.commit(); // Commit the transaction
        return {success: "Label updated successfully"}
    } catch (error) {
        // await transaction.rollback(); // Rollback the transaction
        console.error('Error updating label:', error);
        throw error;
    }
}

const deleteNoteLabels = async (label, userId, transaction) => {
    try {
        const notes = await Note.findAll({
            where: {
                labels: {
                    [Op.like]: `%${label}%`
                },
                user_id: userId
            },
            transaction
        });
        for (const note of notes) {
            note.labels = note.labels.split(',').map(l => l.trim());
            const updatedLabels = note.labels.filter(l => l !== label);
            await Note.update({ labels: updatedLabels.join(',') }, { where: { id: note.id, user_id, userId } }, { transaction });
        }
        return {success: "Note labels deleted successfully"}
    } catch (error) {
        console.error('Error deleting note labels:', error);
        throw error;
    }
}

const deleteLabel = async (labelId, userId) => {
    let transaction;
    try {
        transaction = await sequelize.transaction(); // Start a transaction
        await getLabel(labelId, userId);
        await Label.destroy({
            where: {
                id: labelId,
                user_id: userId
            }});
        await deleteNoteLabels(labelId, userId, transaction);
        await transaction.commit(); // Commit the transaction
        return {success: "Label deleted successfully"}
    } catch (error) {
        await transaction.rollback(); // Rollback the transaction
        console.error('Error deleting label:', error);
        throw error;
    }
}

const getLabeledNotes = async (label, userId) => {
    try {
        const notes = await Note.findAll({
            where: {
                labels: {
                    [Op.like]: `%${label}%`
                },
                user_id: userId,
                trashed: 0
            }
        });
        notes.forEach(note => {
            note.labels = note.labels.split(',').map(label => label.trim());
        });
        return notes;
    } catch (error) {
        console.error('Error getting labeled notes:', error);
        throw error;
    }
}

module.exports = { 
    createLabel, 
    getLabels, 
    getLabel, 
    updateLabel, 
    deleteLabel,
    getLabeledNotes
};