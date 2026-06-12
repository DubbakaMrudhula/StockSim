const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../API/leaderboard_api');
const { protect } = require('../middleware/authMiddleware');

// protect is optional — used only to include myRank in response
router.get('/', (req, res, next) => {
  // Try to attach user if token is present, but don't block if missing
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const { protect: protectMiddleware } = require('../middleware/authMiddleware');
    return protectMiddleware(req, res, () => getLeaderboard(req, res, next));
  }
  return getLeaderboard(req, res, next);
});

module.exports = router;
