
import { useState, useEffect } from 'react';

// Temporary placeholder - will be replaced with actual admin settings
export function useAdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  return { settings, loading, error };
}
