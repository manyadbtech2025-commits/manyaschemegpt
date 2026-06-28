import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Moon, Sun, User, ChevronDown, Globe, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../ui/utils';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { getNotifications, markAsRead, getUnreadCount } from '../../services/notification.service';
import type { Notification } from '../../lib/database.types';

export function Topbar() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function loadNotifications() {
      if (!user?.id) return;
      const [data, count] = await Promise.all([
        getNotifications(user.id),
        getUnreadCount(user.id),
      ]);
      setNotifications(data.slice(0, 5));
      setUnreadCount(count);
    }
    loadNotifications();
  }, [user?.id]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setShowLanguage(false);
  };

  const handleNotificationClick = async (id: string) => {
    await markAsRead(id);
    if (user?.id) {
      const [data, count] = await Promise.all([
        getNotifications(user.id),
        getUnreadCount(user.id),
      ]);
      setNotifications(data.slice(0, 5));
      setUnreadCount(count);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d`;
    if (diffHours > 0) return `${diffHours}h`;
    return 'now';
  };

  return (
    <header className="fixed left-[280px] right-0 top-0 z-40 border-b border-white/10 bg-[#0B0F19]/95 backdrop-blur-xl px-8 py-5">
      <div className="flex items-center justify-between">
        {/* Left: Welcome */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white"
          >
            {t('dashboard.welcome')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/40 text-sm"
          >
            {user?.email || 'Guest'}
          </motion.p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 transition-all focus-within:border-cyan-400/50 focus-within:bg-white/10"
          >
            <Search size={18} className="text-white/40" />
            <input
              type="text"
              placeholder={t('topbar.search')}
              className="bg-transparent text-white outline-none w-[200px] lg:w-[280px] text-sm placeholder:text-white/30"
            />
            <kbd className="hidden lg:inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-xs text-white/40">
              ⌘K
            </kbd>
          </motion.div>

          {/* Language Switcher */}
          <div className="relative">
            <motion.button
              onClick={() => setShowLanguage(!showLanguage)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <Globe size={18} />
              <span className="hidden sm:inline text-sm font-medium">
                {i18n.language === 'en' ? 'EN' : 'हि'}
              </span>
            </motion.button>

            <AnimatePresence>
              {showLanguage && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-white/10 bg-[#0B0F19] p-2 shadow-xl backdrop-blur-xl"
                >
                  <button
                    onClick={() => changeLanguage('en')}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-white/5',
                      i18n.language === 'en' ? 'text-cyan-400' : 'text-white/70'
                    )}
                  >
                    🇬🇧 {t('language.english')}
                  </button>
                  <button
                    onClick={() => changeLanguage('hi')}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-white/5',
                      i18n.language === 'hi' ? 'text-cyan-400' : 'text-white/70'
                    )}
                  >
                    🇮🇳 {t('language.hindi')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-white/10 bg-[#0B0F19] p-4 shadow-xl backdrop-blur-xl"
                >
                  <h3 className="mb-4 font-semibold text-white">
                    {t('dashboard.recentNotifications')}
                  </h3>
                  {notifications.length === 0 ? (
                    <p className="text-white/50 text-sm text-center py-4">No notifications</p>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif.id)}
                          className={cn(
                            'flex items-start gap-3 rounded-xl p-3 transition cursor-pointer',
                            notif.read ? 'bg-white/5' : 'bg-cyan-500/10 border border-cyan-500/20'
                          )}
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
                            <Bell size={16} className="text-cyan-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {notif.title}
                            </p>
                            <p className="text-xs text-white/50">{notif.message}</p>
                          </div>
                          <span className="text-xs text-white/30">{formatTimeAgo(notif.created_at)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <motion.button
              onClick={() => setShowProfile(!showProfile)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-sm font-bold text-white">
                {(user?.email || 'U')[0].toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white">{user?.email?.split('@')[0] || 'User'}</p>
                <p className="text-xs text-white/40">Member</p>
              </div>
              <ChevronDown
                size={16}
                className={cn(
                  'hidden sm:block text-white/40 transition-transform',
                  showProfile && 'rotate-180'
                )}
              />
            </motion.button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-[#0B0F19] p-2 shadow-xl backdrop-blur-xl"
                >
                  <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white">
                    <User size={16} />
                    {t('topbar.profile')}
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white">
                    <Settings size={16} />
                    {t('nav.settings')}
                  </button>
                  <hr className="my-2 border-white/10" />
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      window.location.href = '/';
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
