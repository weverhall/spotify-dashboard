'use client';

import { useEffect, useState } from 'react';
import { Session, SessionSchema } from '../lib/types/schemas';
import UserTracks from '../components/UserTracks';

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = SessionSchema.parse(await res.json());
        setSession(data.authenticated ? data : null);
      } catch {
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  if (loading) {
    return <main>loading session...</main>;
  }

  if (!session) {
    return (
      <main>
        <a href="/api/auth/login">spotify login</a>
      </main>
    );
  }

  return (
    <main>
      <h1>dashboard</h1>
      <p>authenticated: {`${session.authenticated}`}</p>
      <p>expires in: {`${session.expires_in}`}</p>
      <UserTracks />
    </main>
  );
};

export default Dashboard;
