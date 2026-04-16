import { Router } from 'express';
import db from '../data/store.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(db.data.products);
});

router.post('/', async (req, res) => {
  const product = { id: Date.now().toString(), ...req.body };
  db.data.products.push(product);
  await db.write();
  res.status(201).json(product);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const index = db.data.products.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  db.data.products[index] = { ...db.data.products[index], ...req.body };
  await db.write();
  res.json(db.data.products[index]);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const index = db.data.products.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  db.data.products.splice(index, 1);
  await db.write();
  res.status(204).send();
});

export default router;
