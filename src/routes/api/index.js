import express from 'express';
import roles from './roles';
import cards from './cards';

const router = express.Router();

router.use('/roles', roles);
router.use('/cards', cards);

module.exports = router;
