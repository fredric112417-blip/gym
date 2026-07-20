const express = require('express');
const { getMembers, getMemberById, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/lookup/:memberId', auth, getMemberById);
router.get('/', auth, getMembers);
router.post('/', auth, createMember);
router.put('/:id', auth, updateMember);
router.delete('/:id', auth, deleteMember);

module.exports = router;
