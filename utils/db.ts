import { MongoClient } from "mongodb";

export type TokenData = {
  token: string;
  expireAt: Date;
  lastSeen?: string;
};

export const get_mongo_collection = async () => {
  const url = Deno.env.get("MONGODB_URL");

  if (!url) {
    throw new Error("bad env MONGODB_URL");
  }
  const mongoClient = new MongoClient(url);
  await mongoClient.connect();
  const db = mongoClient.db("rsssf");
  const collection = db.collection<TokenData>("api-tokens");
  return collection;
};

export const api_tokens = await get_mongo_collection();
