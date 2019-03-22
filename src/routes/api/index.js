import express from 'express';
import roles from './roles';

const router = express.Router();

router.use('/roles', roles);

module.exports = router;
