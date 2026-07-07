const express = require('express');
const { cleanupTestUsers } = require('../utils/testUserCleanup');
const { requireMongo } = require('../middleware');

const router = express.Router();

router.use(requireMongo);

router.post('/cleanup-test-users', async (req, res) => {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || req.headers['x-admin-secret'] !== secret) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const dryRun = req.query.dryRun === '1' || req.body?.dryRun === true;
    const keepNicknames = req.body?.keepNicknames || process.env.KEEP_NICKNAMES || '';
    const result = await cleanupTestUsers({ dryRun, keepNicknames });
    res.json({
      message: dryRun ? 'Dry run complete' : 'Test users removed',
      ...result,
    });
  } catch (error) {
    console.error('Cleanup test users error:', error);
    res.status(500).json({ message: 'Cleanup failed' });
  }
});

module.exports = router;
