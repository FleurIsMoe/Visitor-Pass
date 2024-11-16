import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

export async function GET() {
  let client;
  try {
    // Connect to MongoDB
    client = await MongoClient.connect(process.env.MONGODB_URI as string)
    const db = client.db('visitor-pass')
    const collection = db.collection('visitors')

    // Use findOneAndUpdate to atomically increment the counter
    const result = await collection.findOneAndUpdate(
      { _id: 'visitor_counter' },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: 'after' }
    )

    // Check if result is null
    if (result === null) {
      console.error('Error: result is null')
      return new Response(JSON.stringify({ visitorNumber: 1 }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
    }

    // If result.value is undefined, initialize the count to 1
    if (!result.value) {
      await collection.insertOne({ _id: 'visitor_counter', count: 1 })
      return new Response(JSON.stringify({ visitorNumber: 1 }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
    }

    // Return the new count
    return new Response(JSON.stringify({ visitorNumber: result.value.count }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Database error:', error)
    return new Response(JSON.stringify({ error: 'Failed to get visitor number', visitorNumber: 1 }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  } finally {
    if (client) {
      await client.close()
    }
  }
}