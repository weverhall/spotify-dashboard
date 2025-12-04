'use client';

import { useEffect, useState } from 'react';
import { AuthTokenSchema, AuthToken } from '../lib/schemas';

const Dashboard = () => {
  const [token, setToken] = useState<AuthToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch('/api/auth/session');
      if (!res.ok) {
        setLoading(false);
        return;
      }

      const parsed = AuthTokenSchema.safeParse(await res.json());
      if (parsed.success) {
        setToken(parsed.data);
      }
      setLoading(false);
    };
    fetchSession();
  }, []);

  if (loading) {
    return <main>loading...</main>;
  }

  if (!token) {
    return (
      <main>
        <a href="/api/auth/login">spotify login</a>
      </main>
    );
  }

  return (
    <main>
      <h1>dashboard</h1>
      <p>token: {token.access_token}</p>
    </main>
  );
};

export default Dashboard;
