import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

export async function GET() {
  let client;
  try {
    client = await MongoClient.connect(process.env.MONGODB_URI as string)
    const db = client.db('visitor-pass')
    const collection = db.collection('visitors')

    const result = await collection.findOneAndUpdate(
      { type: 'visitor_counter' },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: 'after' }
    )

    if (!result) {
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

    return new Response(JSON.stringify({ visitorNumber: result.count || 1 }), {
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