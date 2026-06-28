import { useEffect, useState } from 'react';
import { getSchemeById } from '../services/scheme.service';
import type { Scheme } from '../lib/database.types';

export function useScheme(id?: string) {
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let active = true;

    (async () => {
      setLoading(true);
      const data = await getSchemeById(id);
      if (active) {
        setScheme(data);
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  return { scheme, loading };
}
