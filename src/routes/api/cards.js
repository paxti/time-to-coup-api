import express from 'express';
import cardsData from '../../../data/cards';

const router = express.Router();

router.get('/', (_req, res, _next) => {
  res.json(cardsData);
});

module.exports = router;
