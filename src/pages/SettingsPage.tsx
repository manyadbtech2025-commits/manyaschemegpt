import { Sidebar } from '../components/layout/Sidebar2';
import { Topbar } from '../components/layout/Topbar2';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { FloatingParticles } from '../components/ui/FloatingParticles';
import SettingsHeader from '../components/settings/SettingsHeader';
import AccountSettingsCard from '../components/settings/AccountSettingsCard';
import LanguageCard from '../components/settings/LanguageCard';
import VoiceSettingsCard from '../components/settings/VoiceSettingsCard';
import PrivacyCard from '../components/settings/PrivacyCard';

export function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <AnimatedBackground />
      <FloatingParticles count={40} />

      <Sidebar />

      <div className="ml-[280px]">
        <Topbar />

        <main className="relative z-10 px-8 py-24 space-y-8">
          <SettingsHeader />
          <AccountSettingsCard />
          <LanguageCard />
          <VoiceSettingsCard />
          <PrivacyCard />
        </main>
      </div>
    </div>
  );
}
