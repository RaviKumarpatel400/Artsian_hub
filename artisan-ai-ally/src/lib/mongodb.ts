import { MongoClient, Db } from 'mongodb';

const uri = process.env.REACT_APP_MONGODB_URI || 'your-mongodb-connection-string';
const dbName = process.env.REACT_APP_DB_NAME || 'artisan-marketplace';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();
  
  const db = client.db(dbName);
  
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}
