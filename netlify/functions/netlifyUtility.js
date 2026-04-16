// const { MongoClient, ServerApiVersion } = require("mongodb");
import { MongoClient } from "mongodb";
const uri = process.env.MONGO_URI;

export function createMongoDbClient() {
  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: 0.1,
        strict: true,
        deprecationErrors: true,
      },
    });
    return client;
  } catch (error) {
    console.log("MongoDb error", error);
  }
}
