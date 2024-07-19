const noteController = require('../controller/noteController');

const router = require('express').Router();

router.post('/', noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/archived', noteController.getArchivedNotes);
router.get('/trashed', noteController.getTrashedNotes);
router.get('/:id', noteController.getNote);
router.put('/:id', noteController.updateNote);
router.put('/:id/archive', noteController.archiveNote);
router.put('/:id/unarchive', noteController.unarchiveNote);
router.put('/:id/trash', noteController.trashNote);
router.put('/:id/restore', noteController.restoreNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;