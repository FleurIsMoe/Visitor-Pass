import VisitorPass from '@/components/VisitorPass';
import { getVisitorCount } from '@/lib/visitorCount';

export default async function Home() {
  const visitorNumber = await getVisitorCount();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0e0e0e] via-[#0a0a0a] to-[#181717] p-4">
      <VisitorPass visitorNumber={visitorNumber} />
    </main>
  );
}