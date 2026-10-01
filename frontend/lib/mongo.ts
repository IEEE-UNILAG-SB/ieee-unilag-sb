import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "";

export function hasMongoUri(): boolean {
  return uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://");
}

declare global {
  // eslint-disable-next-line no-var
  var __mongoClient: MongoClient | undefined;
}

let prodClient: MongoClient | undefined;

export function getMongoClient(): MongoClient | undefined {
  if (!hasMongoUri()) return undefined;
  if (process.env.NODE_ENV === "development") {
    if (!global.__mongoClient) {
      global.__mongoClient = new MongoClient(uri);
    }
    return global.__mongoClient;
  }
  if (!prodClient) {
    prodClient = new MongoClient(uri);
  }
  return prodClient;
}

export function getDb(dbName?: string): Db | undefined {
  const client = getMongoClient();
  if (!client) return undefined;
  return client.db(dbName);
}
