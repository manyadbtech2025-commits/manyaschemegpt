import { useEffect, useState } from 'react';
import { getAllSchemes } from '../services/scheme.service';
import type { Scheme } from '../lib/database.types';

export function useSchemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const data = await getAllSchemes();
      if (active) {
        setSchemes(data ?? []);
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { schemes, loading };
}
