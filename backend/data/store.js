import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adapter = new JSONFile(path.join(__dirname, '..', '..', 'db.json'));
const defaultData = { products: [], logs: [] };
const db = new Low(adapter, defaultData);

await db.read();

export default db;
