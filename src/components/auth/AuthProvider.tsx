import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    let active = true;

    // Ensure there is always a session so user-scoped features work without a
    // dedicated login screen. If no session exists, sign in to the shared
    // guest account silently.
    async function ensureSession() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;

      if (data.session?.user) {
        setUser(data.session.user);
        setLoading(false);
        return;
      }

      const { data: signInData, error } = await supabase.auth.signInWithPassword(
        {
          email: "guest@schemegpt.app",
          password: "SchemeGPT-Guest-2025",
        }
      );

      if (!active) return;

      if (error) {
        console.error("[v0] Guest sign-in failed:", error.message);
      }

      setUser(signInData?.user ?? null);
      setLoading(false);
    }

    ensureSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
