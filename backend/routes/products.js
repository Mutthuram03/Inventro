import { Router } from 'express';
import db from '../data/store.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(db.data.products);
});

router.post('/', async (req, res) => {
  try {
    if (!db.data.products) db.data.products = [];
    
    const product = { 
      id: Date.now().toString(), 
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    db.data.products.push(product);
    await db.write();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
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
