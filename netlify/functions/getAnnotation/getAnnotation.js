import { createMongoDbClient } from "../netlifyUtility";
const client = createMongoDbClient();

export default async () => {
  try {
    const db = client.db("pdf");
    const collection = db.collection("noted");
    const docs = await collection.find({}).toArray();

    return new Response(JSON.stringify(docs), {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
    });
  }
};
