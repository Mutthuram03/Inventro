import { Router } from 'express';
import db from '../data/store.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

// Get profile (protected)
router.get('/', verifyToken, (req, res) => {
  const uid = req.user.uid;
  const profile = db.data.profiles?.[uid] || {
    managerName: req.user.name || '',
    email: req.user.email,
    industryName: '',
    phone: '',
    address: '',
    role: 'Warehouse Manager'
  };
  res.json(profile);
});

// Update profile (protected)
router.put('/', verifyToken, async (req, res) => {
  const uid = req.user.uid;
  if (!db.data.profiles) db.data.profiles = {};
  
  db.data.profiles[uid] = { 
    ...db.data.profiles[uid], 
    ...req.body,
    email: req.user.email // Ensure email matches auth
  };
  
  await db.write();
  res.json(db.data.profiles[uid]);
});

export default router;
