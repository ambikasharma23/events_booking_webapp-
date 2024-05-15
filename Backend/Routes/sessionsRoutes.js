const express = require('express');
const router = express.Router();
const sessionController = require('../Controllers/sessionscontroller');

// Create a session for an event
router.post('/', sessionController.createSession);

router.put('/:id', sessionController.updateSession);

router.delete('/:id', sessionController.deleteSession);

module.exports = router;
