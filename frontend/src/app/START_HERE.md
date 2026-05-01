# 🔥 Configuración Rápida - PokeBox con Supabase

## ✅ CREDENCIALES APLICADAS

Tus credenciales de Supabase ya están configuradas en el código:

- **URL**: `https://inubqjubhocnfkawziqx.supabase.co`
- **Anon Key**: `sb_publishable_kOMRQxXVVN0EiREffWtb8w_LBhls-CQ`

## 🚀 PASOS INMEDIATOS

### 1️⃣ Crear las Tablas en Supabase (URGENTE)

**Esto es OBLIGATORIO antes de usar la aplicación:**

1. Ve a: https://app.supabase.com/project/inubqjubhocnfkawziqx/sql/new
2. Abre el archivo `/database/schema.sql` de este proyecto
3. **COPIA TODO EL CONTENIDO** (Ctrl+A, Ctrl+C)
4. **PEGA en el SQL Editor** de Supabase
5. Click en el botón **RUN** (esquina superior derecha)
6. Espera confirmación de éxito ✅

**Verificar que funcionó:**
- Ve a: https://app.supabase.com/project/inubqjubhocnfkawziqx/editor
- Deberías ver las tablas: `users`, `inventory`, `case_openings`, `marketplace_listings`

### 2️⃣ Probar la Aplicación

Una vez creadas las tablas:

1. **Inicia la aplicación** (si no está corriendo)
2. Ve a **http://localhost:5173/register** (o tu URL)
3. **Regístrate** con:
   - Username: `testuser`
   - Email: `test@pokebox.com`
   - Password: `123456`
4. **Inicia sesión**
5. **Ve a Cases** → Selecciona "Fire Legend"
6. Click **"Open Case"**
7. **Ve a Inventory** (menú de usuario arriba a la derecha)

### 3️⃣ Verificar en Supabase Dashboard

Después de abrir una caja, verifica que los datos se guardaron:

**Ver usuarios registrados:**
https://app.supabase.com/project/inubqjubhocnfkawziqx/editor/28889

**Ver inventario:**
https://app.supabase.com/project/inubqjubhocnfkawziqx/editor/28890

**Ver historial de aperturas:**
https://app.supabase.com/project/inubqjubhocnfkawziqx/editor/28891

## 🐘 Conectar DBeaver (Opcional)

### Obtener Credenciales de Conexión

1. Ve a: https://app.supabase.com/project/inubqjubhocnfkawziqx/settings/database
2. Busca **"Connection string"** → **"URI"**
3. Copia la cadena (debe verse así):
   ```
   postgresql://postgres:[TU-PASSWORD]@db.inubqjubhocnfkawziqx.supabase.co:5432/postgres
   ```

### Configurar en DBeaver

1. Abre DBeaver
2. **Database** → **New Database Connection** → **PostgreSQL**
3. Ingresa:
   ```
   Host: db.inubqjubhocnfkawziqx.supabase.co
   Port: 5432
   Database: postgres
   Username: postgres
   Password: [Tu contraseña de Supabase]
   ```
4. **Test Connection** → **Finish**

### Navegar a las Tablas

```
Databases → postgres → Schemas → public → Tables
```

## 🔧 Queries Rápidos para DBeaver

### Ver todos los usuarios
```sql
SELECT * FROM public.users;
```

### Ver inventario completo
```sql
SELECT 
  u.username,
  i.item_name,
  i.rarity,
  i.value,
  i.obtained_at
FROM public.inventory i
JOIN public.users u ON i.user_id = u.id
ORDER BY i.obtained_at DESC;
```

### Ver últimas aperturas
```sql
SELECT 
  u.username,
  co.case_name,
  co.item_name,
  co.rarity,
  co.value,
  co.opened_at
FROM public.case_openings co
JOIN public.users u ON co.user_id = u.id
ORDER BY co.opened_at DESC
LIMIT 20;
```

### Estadísticas por usuario
```sql
SELECT 
  u.username,
  u.balance,
  u.level,
  COUNT(i.id) as total_items,
  COALESCE(SUM(i.value), 0) as inventory_value,
  COUNT(co.id) as total_cases_opened
FROM public.users u
LEFT JOIN public.inventory i ON u.id = i.user_id AND i.is_listed = false
LEFT JOIN public.case_openings co ON u.id = co.user_id
GROUP BY u.id
ORDER BY inventory_value DESC;
```

## 🎯 Funcionalidades Activas

### ✅ Sistema de Autenticación
- [x] Registro con validación
- [x] Login seguro
- [x] Sesiones persistentes
- [x] Balance inicial de $1000

### ✅ Sistema de Cajas
- [x] Apertura con animación
- [x] Deducción de balance
- [x] Generación de items aleatorios
- [x] Probabilidades por rareza

### ✅ Sistema de Inventario
- [x] Guardado automático en BD
- [x] Vista de todos los items
- [x] Filtros por rareza
- [x] Estadísticas de valor total

### ✅ Seguridad
- [x] Row Level Security activo
- [x] Usuarios solo ven sus datos
- [x] Políticas de acceso configuradas

## ⚠️ IMPORTANTE: Seguridad de Credenciales

**NUNCA compartas estas credenciales públicamente:**
- ❌ No las subas a GitHub público
- ❌ No las compartas en foros
- ✅ Usa `.env` (ya configurado)
- ✅ Agrega `.env` a `.gitignore`

**Archivo `.gitignore` debe incluir:**
```
.env
.env.local
.env.production
```

## 🆘 Solución de Problemas

### Error: "Invalid API key"
**Solución:**
1. Ve a: https://app.supabase.com/project/inubqjubhocnfkawziqx/settings/api
2. Copia la **"anon public"** key
3. Reemplaza en `/lib/supabase.ts`

### Error: "relation does not exist"
**Solución:**
- No ejecutaste el script SQL
- Ve al **Paso 1️⃣** arriba y ejecuta el schema.sql

### No se guardan los datos
**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Verifica que las tablas existan en Supabase
4. Confirma que el usuario esté autenticado

### Error de autenticación en DBeaver
**Solución:**
1. Verifica que usaste la contraseña correcta
2. Confirma que el puerto sea 5432
3. Chequea que tu IP esté permitida:
   - Ve a Settings → Database → Connection Pooling
   - Supabase permite todas las IPs por defecto

## 📊 Dashboard de Supabase

**Accesos Rápidos:**

- **SQL Editor**: https://app.supabase.com/project/inubqjubhocnfkawziqx/sql
- **Table Editor**: https://app.supabase.com/project/inubqjubhocnfkawziqx/editor
- **Authentication**: https://app.supabase.com/project/inubqjubhocnfkawziqx/auth/users
- **Database Settings**: https://app.supabase.com/project/inubqjubhocnfkawziqx/settings/database
- **API Settings**: https://app.supabase.com/project/inubqjubhocnfkawziqx/settings/api

## 🎮 Testing Checklist

Prueba todo en orden:

- [ ] Ejecutar schema.sql en Supabase
- [ ] Verificar que las tablas existan
- [ ] Registrar usuario nuevo
- [ ] Iniciar sesión
- [ ] Ver balance de $1000 en header
- [ ] Ir a /cases
- [ ] Abrir "Fire Legend" (cuesta $499)
- [ ] Ver animación de apertura
- [ ] Click en "View Inventory"
- [ ] Ver el item obtenido
- [ ] Verificar nuevo balance ($501 restante)
- [ ] Abrir otra caja
- [ ] Ver 2 items en inventario
- [ ] Filtrar por rareza
- [ ] Cerrar sesión
- [ ] Iniciar sesión nuevamente
- [ ] Verificar que todo persiste

## 📚 Archivos Importantes

```
/.env                      ← Variables de entorno (PRIVADO)
/lib/supabase.ts          ← Cliente de Supabase
/database/schema.sql      ← Script de creación de tablas
/context/AuthContext.tsx  ← Lógica de autenticación
/components/inventory/    ← Página de inventario
/components/cases/        ← Sistema de apertura
```

## 🎯 Próximos Features Sugeridos

1. **Marketplace Funcional**
   - Listar items para vender
   - Comprar items de otros usuarios
   - Sistema de transacciones

2. **Live Feed con Realtime**
   - Ver aperturas de otros en vivo
   - Notificaciones de drops raros
   - Animaciones en tiempo real

3. **Sistema de Batallas**
   - 1v1 contra otros jugadores
   - Apostar items o balance
   - Rankings y leaderboards

4. **Recompensas y Achievements**
   - Daily login rewards
   - Sistema de logros
   - Niveles y experiencia

---

## 🚀 ¡TODO LISTO!

Tu plataforma PokeBox está completamente integrada con Supabase. 

**Siguiente paso:** Ejecuta el schema.sql y empieza a probar! 🎉
