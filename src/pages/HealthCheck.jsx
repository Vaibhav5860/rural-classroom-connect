import React, { useEffect, useState, useRef } from 'react';
import axios from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HealthCheck() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/health');
      setStatus({ ok: true, ...data });
    } catch (err) {
      const errMsg = err?.response?.data?.error || err?.message || 'Network error';
      setStatus({ ok: false, error: errMsg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    intervalRef.current = setInterval(fetchHealth, 10000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="font-display text-2xl mb-4">Health Check</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className={`text-${status?.ok ? 'green-500' : 'red-500'}`}>{status?.ok ? 'OK' : 'Down'}</span>
            <span className="text-sm text-muted-foreground">{status?.env ? `(${status.env})` : ''}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>Node: <strong>{status?.nodeVersion || '-'}</strong></div>
            <div>Mongoose: <strong>{status?.mongooseVersion || '-'}</strong></div>
            <div>Uptime: <strong>{status?.uptime ? `${Math.round(status.uptime)}s` : '-'}</strong></div>
            <div>DB Connected: <strong>{status?.dbConnected ? 'Yes' : 'No'}</strong></div>
            <div>DB Host: <strong>{status?.dbHost || '-'}</strong></div>
            <div>Using Atlas: <strong>{status?.usingAtlas ? 'Yes' : 'No'}</strong></div>
            {status?.error && <div className="text-destructive">Error: {status.error}</div>}

            <div className="flex gap-2 mt-4">
              <Button onClick={fetchHealth} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
