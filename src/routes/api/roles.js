import express from 'express';

const router = express.Router();

router.get('/', (_req, res, _next) => {
  res.json({ tags: 'Hello world' });
});

module.exports = router;
