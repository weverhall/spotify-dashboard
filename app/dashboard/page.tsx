'use client';

import { useEffect, useState } from 'react';
import { Session, SessionSchema } from '../lib/schemas';

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch('/api/auth/session');
      const data = SessionSchema.parse(res);
      setSession(data.authenticated ? data : null);
      setLoading(false);
    };
    fetchSession();
  }, []);

  if (loading) {
    return <main>loading...</main>;
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
      <p>authenticated: {session.authenticated}</p>
      <p>expires in: {session.expires_in} seconds</p>
    </main>
  );
};

export default Dashboard;
