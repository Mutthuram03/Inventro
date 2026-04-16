import { Router } from 'express';
import db from '../data/store.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(db.data.logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
});

export default router;
