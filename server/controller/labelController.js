const labelService = require('../service/labelService');

const createLabel = async (req, res) => {
    try {
        const label = req.body;
        label.user_id = req.user.id;
        const result = await labelService.createLabel(label);
        res.status(201).send(result);
    } catch (error) {
        console.error('Error creating label:', error);
        res.status(error.statusCode || 500).send({ error: error.message });
    }
}

const getLabels = async (req, res) => {
    try {
        const labels = await labelService.getLabels(req.user.id);
        res.status(200).send(labels);
    } catch (error) {
        console.error('Error getting labels:', error);
        res.status(error.statusCode || 500).send({ error: error.message });
    }
}

const getLabel = async (req, res) => {
    try {
        const labelId = req.params.id;
        const userId = req.user.id;
        const label = await labelService.getLabel(labelId, userId);
        res.status(200).send(label);
    } catch (error) {
        console.error('Error getting label:', error);
        res.status(error.statusCode || 500).send({ error: error.message });
    }
}

const updateLabel = async (req, res) => {
    try {
        const labelId = req.params.id;
        const label = req.body;
        const userId = req.user.id;
        const result = await labelService.updateLabel(labelId, label, userId);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error updating label:', error);
        res.status(error.statusCode || 500).send({ error: error.message });
    }
}

const deleteLabel = async (req, res) => {
    try {
        const labelId = req.params.id;
        const userId = req.user.id;
        const result = await labelService.deleteLabel(labelId, userId);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error deleting label:', error);
        res.status(error.statusCode || 500).send({ error: error.message });
    }
}

const getLabeledNotes = async (req, res) => {
    try {
        const label = req.params.label;
        const userId = req.user.id;
        const notes = await labelService.getLabeledNotes(label, userId);
        res.status(200).send(notes);
    } catch (error) {
        console.error('Error getting labeled notes:', error);
        res.status(error.statusCode || 500).send({ error: error.message });
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