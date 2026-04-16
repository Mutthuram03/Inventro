import cors from 'cors';
import express from 'express';
import productsRouter from './routes/products.js';
import scanRouter from './routes/scan.js';
import logsRouter from './routes/logs.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Scanventory API!' });
});

app.get('/health', (request, response) => {
  response.json({ status: 'ok', service: 'stockscan-api' });
});

app.use('/products', productsRouter);
app.use('/scan', scanRouter);
app.use('/logs', logsRouter);

app.use((request, response) => {
  response.status(404).json({ message: 'Route not found.' });
});

app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).json({ message: 'Internal server error.' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
