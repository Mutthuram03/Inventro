import { Router } from 'express';
import db from '../data/store.js';

const router = Router();

router.post('/', async (req, res) => {
  const { barcode, action, quantity } = req.body;
  const product = db.data.products.find((p) => p.barcode === barcode);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const newQuantity = action === 'IN' ? product.quantity + quantity : product.quantity - quantity;
  if (newQuantity < 0) {
    return res.status(400).json({ message: 'Not enough stock' });
  }

  product.quantity = newQuantity;

  const log = {
    id: Date.now().toString(),
    productId: product.id,
    action,
    quantity,
    timestamp: new Date().toISOString()
  };
  db.data.logs.push(log);

  await db.write();
  res.json({ product, log });
});

export default router;
