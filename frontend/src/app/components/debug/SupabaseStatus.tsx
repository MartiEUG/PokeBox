import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Card } from '../ui/Card';
import { CheckCircle2, XCircle, Loader2, AlertTriangle } from 'lucide-react';

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
      setMessage('⚠️ Supabase no configurado. Usando almacenamiento local (localStorage).');
      return;
    }

    try {
      // Try to connect to Supabase
      const { data, error } = await supabase.from('users').select('count').limit(1);
      
      if (error) {
        // Check if it's a table not found error (expected before running schema)
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          setStatus('error');
          setMessage('⚠️ Conexión OK pero las tablas no están creadas. ¡Ejecuta schema.sql en el SQL Editor de Supabase!');
        } else if (error.message.includes('JWT') || error.message.includes('API key')) {
          setStatus('disabled');
          setMessage('⚠️ API key de Supabase inválida. Usando localStorage. Ve a Settings > API en tu proyecto Supabase para obtener la clave correcta.');
        } else {
          setStatus('error');
          setMessage(`Error: ${error.message}`);
        }
      } else {
        setStatus('connected');
        setMessage('✅ Supabase conectado correctamente!');
      }
    } catch (error: any) {
      setStatus('disabled');
      setMessage(`⚠️ Error de conexión. Usando localStorage como fallback.`);
    }
  };

  if (status === 'checking') {
    return null; // Don't show while checking
  }

  // Don't show if everything is working
  if (status === 'connected') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className={`border-2 ${
        status === 'connected' 
          ? 'border-green-500/50 bg-green-950/50' 
          : status === 'disabled'
          ? 'border-blue-500/50 bg-blue-950/50'
          : 'border-yellow-500/50 bg-yellow-950/50'
      }`}>
        <div className="flex items-start gap-3">
          {status === 'checking' && (
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
          )}
          {status === 'connected' && (
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
          )}
          {status === 'disabled' && (
            <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0" />
          )}
          {status === 'error' && (
            <XCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white mb-1">
              {status === 'checking' && 'Verificando conexión a Supabase...'}
              {status === 'connected' && 'Base de Datos Conectada'}
              {status === 'disabled' && 'Modo Local Activo'}
              {status === 'error' && 'Configuración de Base de Datos Requerida'}
            </div>
            <div className="text-xs text-gray-300 break-words">
              {message}
            </div>
            {status === 'error' && message.includes('tablas') && (
              <a 
                href="https://app.supabase.com/project/inubqjubhocnfkawziqx/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-400 transition-colors"
              >
                Abrir SQL Editor →
              </a>
            )}
            {status === 'disabled' && message.includes('API key') && (
              <a 
                href="https://app.supabase.com/project/inubqjubhocnfkawziqx/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-400 transition-colors"
              >
                Ver API Settings →
              </a>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}