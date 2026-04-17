import { createMongoDbClient } from "../netlifyUtility";
const client = createMongoDbClient();

export default async () => {
  console.log("Inside Annotation funciton");
  try {
    await client.connect();
    const db = client.db("pdf");
    const collection = db.collection("notes");
    const docs = await collection.find({}).toArray();
    console.log("Annotation docs from Mongodb", docs);
    return new Response(JSON.stringify(docs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("getAnnotation Error", error);
    return new Response(error.toString(), {
      status: 500,
    });
  }
};
