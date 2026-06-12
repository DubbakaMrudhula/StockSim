const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
  getDashboardStats,
  getUsers,
  toggleUserActive,
  resetUserWallet,
  deleteUser,
  getAllTransactions,
} = require('../API/admin_api');

// All routes require authentication + admin role
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/toggle-active', toggleUserActive);
router.put('/users/:id/reset-wallet', resetUserWallet);
router.delete('/users/:id', deleteUser);
router.get('/transactions', getAllTransactions);

module.exports = router;
