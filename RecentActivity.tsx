import { useEffect, useState } from 'react';
import { Bell, CircleCheck as CheckCircle, Clock, Sparkles, TriangleAlert as AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getNotifications } from '../../services/notification.service';
import type { Notification } from '../../lib/database.types';

const iconMap: Record<string, React.ReactNode> = {
  info: <Bell size={18} />,
  warning: <AlertTriangle size={18} />,
  success: <CheckCircle size={18} />,
  urgent: <Clock size={18} />,
};

const colorMap: Record<string, string> = {
  info: 'text-cyan-400',
  warning: 'text-orange-400',
  success: 'text-green-400',
  urgent: 'text-red-400',
};

export default function RecentActivity() {
  const { user } = useAuthStore();
  const [activities, setActivities] = useState<Notification[]>([]);

  useEffect(() => {
    async function load() {
      if (!user?.id) return;
      const data = await getNotifications(user.id);
      setActivities(data.slice(0, 6));
    }
    load();
  }, [user?.id]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (activities.length === 0) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-[#111827] p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Recent Activity</h2>
          <p className="mt-2 text-white/40">Latest updates from your account</p>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 mb-4">
            <Bell className="h-8 w-8 text-white/30" />
          </div>
          <p className="text-white/50">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-[#111827] p-8">

      <div className="mb-8">

        <h2 className="text-3xl font-bold text-white">
          Recent Activity
        </h2>

        <p className="mt-2 text-white/40">
          Latest updates from your account
        </p>

      </div>

      <div className="space-y-5">

        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-5 rounded-3xl border border-white/10 bg-[#0B0F19] p-6 transition-all hover:border-cyan-400/20"
          >

            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 ${colorMap[activity.type] || 'text-cyan-400'}`}
            >
              {iconMap[activity.type] || <Sparkles size={18} />}
            </div>

            <div className="flex-1">

              <h3 className="text-lg font-semibold text-white">
                {activity.title}
              </h3>

              <p className="mt-1 text-sm text-white/40">
                {activity.message}
              </p>

            </div>

            <span className="text-xs text-white/30 shrink-0">
              {formatTimeAgo(activity.created_at)}
            </span>

          </div>
        ))}

      </div>

    </div>
  )
}
