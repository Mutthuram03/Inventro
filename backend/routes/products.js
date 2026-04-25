import { Router } from 'express';
import db from '../data/store.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(db.data.products);
});

router.post('/', async (req, res) => {
  try {
    const { name, category, barcode, quantity, price } = req.body;
    
    // Basic validation
    if (!name || !barcode) {
      return res.status(400).json({ message: 'Name and barcode are required' });
    }

    if (!db.data.products) db.data.products = [];
    
    const product = { 
      id: req.body.id || Date.now().toString(), 
      name,
      category: category || 'Uncategorized',
      barcode,
      quantity: Number(quantity) || 0,
      price: Number(price) || 0,
      createdAt: new Date().toISOString()
    };
    
    // Check for duplicate barcode
    const existing = db.data.products.find(p => p.barcode === barcode);
    if (existing) {
      return res.status(400).json({ message: `Product with barcode ${barcode} already exists` });
    }

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
  await db.read();
  const { id } = req.params;
  const index = db.data.products.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  db.data.products.splice(index, 1);
  await db.write();
  res.status(204).send();
});

export default router;
