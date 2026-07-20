const express = require('express');
const { getTrainers, createTrainer, updateTrainer, deleteTrainer } = require('../controllers/trainerController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getTrainers);
router.post('/', auth, createTrainer);
router.put('/:id', auth, updateTrainer);
router.delete('/:id', auth, deleteTrainer);

module.exports = router;
