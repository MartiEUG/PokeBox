import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../../utils/supabase/client';
import { Card } from '../ui/Card';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export function SupabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error' | 'disabled'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured || !supabase) {
      setStatus('disabled');
      setMessage('⚠️ Supabase no configurado');
      return;
    }

    try {
      // Try to get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      setStatus('connected');
      if (session) {
        setMessage(`✅ Conectado como ${session.user.email}`);
      } else {
        setMessage('✅ Supabase conectado correctamente');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  if (status === 'checking') {
    return null;
  }

  // Don't show if everything is working
  if (status === 'connected') {
    return null;
  }

  const iconColor = status === 'disabled' ? 'text-blue-400' : status === 'error' ? 'text-red-400' : 'text-yellow-400';
  const borderColor = status === 'disabled' ? 'border-blue-500/50' : status === 'error' ? 'border-red-500/50' : 'border-yellow-500/50';
  const bgColor = status === 'disabled' ? 'bg-blue-950/50' : status === 'error' ? 'bg-red-950/50' : 'bg-yellow-950/50';

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className={`border-2 ${borderColor} ${bgColor} p-3`}>
        <div className="flex items-start gap-3">
          {status === 'disabled' && (
            <AlertTriangle className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
          )}
          {status === 'error' && (
            <XCircle className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white">{message}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}