import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export async function getVisitorCount(): Promise<number> {
  try {
    const client = await clientPromise;
    const db = client.db('visitor-pass');
    const collection = db.collection('visitorCount');

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId('visitorCount') },
      { $inc: { count: 1 } },
      { returnDocument: 'after', upsert: true }
    );

    if (result === null || result.value === null) {
      throw new Error('No document found');
    }

    return result.value.count;
  } catch (error) {
    console.error('Error getting visitor count:', error);
    return 1;
  }
}