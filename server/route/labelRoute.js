const express = require('express');
const router = express.Router();
const labelController = require('../controller/labelController');

router.post('/', labelController.createLabel);
router.get('/', labelController.getLabels);
router.get('/:id', labelController.getLabel);
router.put('/:id', labelController.updateLabel);
router.delete('/:id', labelController.deleteLabel);
router.get('/:label/notes', labelController.getLabeledNotes);

module.exports = router;