import { useParams } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar2';
import { Topbar } from '../components/layout/Topbar2';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { FloatingParticles } from '../components/ui/FloatingParticles';
import SchemeDetails from '../components/scheme/SchemeDetails';

export function SchemeDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <AnimatedBackground />
      <FloatingParticles count={40} />

      <Sidebar />

      <div className="ml-[280px]">
        <Topbar />

        <main className="relative z-10 px-8 py-24">
          <SchemeDetails id={id} />
        </main>
      </div>
    </div>
  );
}
