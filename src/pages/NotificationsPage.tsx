import { useEffect, useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar2';
import { Topbar } from '../components/layout/Topbar2';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { FloatingParticles } from '../components/ui/FloatingParticles';
import NotificationHeader from '../components/notifications/NotificationHeader';
import RecentActivity from '../components/notifications/RecentActivity';
import { useAuthStore } from '../store/authStore';
import { getNotifications, markAllAsRead } from '../services/notification.service';
import type { Notification } from '../lib/database.types';

export function NotificationsPage() {
  const { user } = useAuthStore();
  const [, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    async function load() {
      if (!user?.id) return;
      const data = await getNotifications(user.id);
      setNotifications(data);
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
          <NotificationHeader />

          <div className="flex justify-end">
            <button
              onClick={async () => {
                if (!user?.id) return;
                await markAllAsRead(user.id);
                const data = await getNotifications(user.id);
                setNotifications(data);
              }}
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Mark All Read
            </button>
          </div>

          <RecentActivity />
        </main>
      </div>
    </div>
  );
}
