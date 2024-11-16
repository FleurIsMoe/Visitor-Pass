import VisitorPass from '@/components/VisitorPass'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getVisitorNumber() {
  try {
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/visitor`, {
      cache: 'no-store',
    })
    if (!response.ok) throw new Error('Failed to fetch visitor number')
    const data = await response.json()
    return data.visitorNumber
  } catch (error) {
    console.error('Error fetching visitor number:', error)
    return 1
  }
}

export default async function Home() {
  const visitorNumber = await getVisitorNumber()

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <VisitorPass visitorNumber={visitorNumber} />
    </main>
  )
}