import { MongoClient } from "mongodb";

async function getClient() {
  let mongoDbClient = new MongoClient(process.env.MONGO_URI);
  await mongoDbClient.connect();
  return mongoDbClient;
}
