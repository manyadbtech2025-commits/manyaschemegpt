import { useEffect, useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar2';
import { Topbar } from '../components/layout/Topbar2';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { FloatingParticles } from '../components/ui/FloatingParticles';
import ProfileHeader from '../components/profile/ProfileHeader';
import PersonalInfoCard from '../components/profile/PersonalInfoCard';
import ProfileForm from '../components/profile/ProfileForm';
import { useAuthStore } from '../store/authStore';
import { getProfile } from '../services/profile.service';
import type { Profile } from '../lib/database.types';

export function ProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function load() {
      if (!user?.id) return;
      const data = await getProfile(user.id);
      setProfile(data);
    }
    load();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <AnimatedBackground />
      <FloatingParticles count={40} />

      <Sidebar />

      <div className="ml-[280px]">
        <Topbar />

        <main className="relative z-10 px-8 py-24 space-y-8">
          {profile && <ProfileHeader profile={profile} />}
          <PersonalInfoCard profile={profile || undefined} />
          <ProfileForm />
        </main>
      </div>
    </div>
  );
}
