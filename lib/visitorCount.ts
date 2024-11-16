import clientPromise from './mongodb';

export async function getVisitorCount(): Promise<number> {
  try {
    const client = await clientPromise;
    const db = client.db('visitor-pass');
    const collection = db.collection('visitorCount');

    const result = await collection.findOneAndUpdate(
      { type: 'visitorCount' },
      { $inc: { count: 1 } },
      { returnDocument: 'after', upsert: true }
    );

    // Check if result is null
    if (result === null) {
      console.error('Error: result is null');
      return 1;
    }

    // If result.value is undefined, initialize the count to 1
    if (!result.value) {
      await collection.insertOne({ type: 'visitorCount', count: 1 });
      return 1;
    }

    return result.value.count;
  } catch (error) {
    console.error('Error getting visitor count:', error);
    return 1;
  }
}