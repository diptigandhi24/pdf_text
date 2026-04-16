import { createMongoDbClient } from "../netlifyUtility";
const client = createMongoDbClient();

export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  let body = await request.json();
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const db = client.db("pdf");
    const collection = db.collection("noted");
    const result = await collection.insertOne({ ...body });

    return Response.json({
      success: result.status,
    });
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
    });
  } finally {
    // Ensures that the client will close when you finish/error

    return new Response(`Hello World 111`);
  }
};

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

// async function run() {
//   try {
//   }
// }
// run().catch(console.dir);
