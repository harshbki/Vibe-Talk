const express = require('express');
const router = express.Router();
const {
  createGroup,
  getUserGroups,
  getGroupById,
  addMember,
  removeMember,
  deleteGroup,
  getAllPublicGroups,
  joinGroup,
  requestJoinGroup,
  approveJoinRequest,
  rejectJoinRequest
} = require('../controllers/groupController');

router.post('/', createGroup);
router.get('/discover', getAllPublicGroups);
router.get('/user/:userId', getUserGroups);
router.get('/:groupId', getGroupById);
router.post('/:groupId/add-member', addMember);
router.post('/:groupId/remove-member', removeMember);
router.post('/:groupId/join', joinGroup);
router.post('/:groupId/request-join', requestJoinGroup);
router.post('/:groupId/approve-join', approveJoinRequest);
router.post('/:groupId/reject-join', rejectJoinRequest);
router.delete('/:groupId', deleteGroup);

module.exports = router;
