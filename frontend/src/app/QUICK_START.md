# ⚡ INICIO RÁPIDO - PokeBox + Supabase

## 🎯 TUS CREDENCIALES YA ESTÁN APLICADAS ✅

```
URL: https://inubqjubhocnfkawziqx.supabase.co
Key: sb_publishable_kOMRQxXVVN0EiREffWtb8w_LBhls-CQ
```

## 🚨 PASO CRÍTICO - CREAR TABLAS

**SIN ESTE PASO LA APLICACIÓN NO FUNCIONARÁ**

### Opción 1: Copiar y Pegar (Recomendado)

1. **Abre este enlace**: https://app.supabase.com/project/inubqjubhocnfkawziqx/sql/new

2. **Abre el archivo**: `/database/schema.sql` (en este proyecto)

3. **Copia TODO** (son ~220 líneas de código SQL)

4. **Pega en Supabase SQL Editor**

5. **Click en RUN** (botón verde arriba a la derecha)

6. **Espera el mensaje**: "Success. No rows returned"

### Opción 2: Línea por Línea (Si hay errores)

Si el paso anterior falla, ejecuta estos comandos UNO POR UNO:

```sql
-- 1. Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```
Click RUN, espera éxito, luego:

```sql
-- 2. Crear tabla users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  balance DECIMAL(10, 2) DEFAULT 1000.00,
  level INTEGER DEFAULT 1,
  avatar_url TEXT,
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20)
);
```
Click RUN, espera éxito, continúa con las siguientes tablas...

### ✅ Verificar que Funcionó

Ve a: https://app.supabase.com/project/inubqjubhocnfkawziqx/editor

Deberías ver estas 4 tablas:
- ✅ users
- ✅ inventory  
- ✅ case_openings
- ✅ marketplace_listings

## 🎮 PROBAR LA APLICACIÓN

### 1. Iniciar el Servidor

```bash
npm run dev
# o
yarn dev
```

### 2. Abrir en el Navegador

```
http://localhost:5173
```

### 3. Registro de Usuario

1. Click en **"Register"** (arriba a la derecha)
2. Completa el formulario:
   ```
   Username: testuser
   Email: test@pokebox.com
   Password: password123
   ```
3. Click **"Sign Up"**

**✅ Si funciona:** Serás redirigido automáticamente

**❌ Si hay error:** 
- Revisa la consola del navegador (F12)
- Verifica que ejecutaste el schema.sql
- Mira el indicador en la esquina inferior derecha

### 4. Abrir una Caja

1. Ve a **"Cases"** (menú superior)
2. Click en **"Fire Legend"** ($499)
3. Click en **"Open Case"**
4. Disfruta la animación ✨
5. Click en **"View Inventory"**

### 5. Ver tu Inventario

- En el header, click en tu **username**
- Selecciona **"Inventory"**
- Verás el item que obtuviste

## 🔍 INDICADOR DE ESTADO

En la **esquina inferior derecha** verás uno de estos mensajes:

### ✅ Verde: "Database Connected"
```
Todo funcionando correctamente
```

### ⚠️ Amarillo: "Database Setup Required"
```
Conexión OK pero tablas no creadas
→ Click en "Open SQL Editor"
→ Ejecuta el schema.sql
```

### ❌ Rojo: Error de Conexión
```
Problema con las credenciales
→ Verifica que la API key sea correcta
→ Ve a Supabase Settings → API
```

## 📊 VER DATOS EN SUPABASE

### Tabla de Usuarios
https://app.supabase.com/project/inubqjubhocnfkawziqx/editor/28889

Verás todos los usuarios registrados

### Tabla de Inventario
https://app.supabase.com/project/inubqjubhocnfkawziqx/editor/28890

Verás todos los items obtenidos

### Tabla de Aperturas
https://app.supabase.com/project/inubqjubhocnfkawziqx/editor/28891

Verás el historial completo de aperturas

### Authentication
https://app.supabase.com/project/inubqjubhocnfkawziqx/auth/users

Verás los usuarios autenticados

## 🐘 CONECTAR DBEAVER

### Paso 1: Obtener Contraseña

1. Ve a: https://app.supabase.com/project/inubqjubhocnfkawziqx/settings/database
2. Busca **"Database Password"**
3. Si no la recuerdas, puedes resetearla aquí

### Paso 2: Configurar DBeaver

1. Abre DBeaver
2. Menú **Database** → **New Database Connection**
3. Selecciona **PostgreSQL**
4. Ingresa estos datos:

```
Host: db.inubqjubhocnfkawziqx.supabase.co
Port: 5432
Database: postgres
Username: postgres
Password: [Tu contraseña de Supabase]
```

5. Click **Test Connection**
6. Si funciona → **Finish**

### Paso 3: Navegar

```
Conexión → postgres → Schemas → public → Tables
```

Aquí verás todas tus tablas y podrás:
- Ejecutar queries
- Ver datos en tiempo real
- Exportar información
- Hacer análisis

## 📝 QUERIES ÚTILES

### Ver balance de usuarios
```sql
SELECT 
  username,
  balance,
  level,
  created_at
FROM public.users
ORDER BY balance DESC;
```

### Ver items más valiosos
```sql
SELECT 
  u.username,
  i.item_name,
  i.rarity,
  i.value
FROM public.inventory i
JOIN public.users u ON i.user_id = u.id
ORDER BY i.value DESC
LIMIT 10;
```

### Actividad reciente
```sql
SELECT 
  u.username,
  co.case_name,
  co.item_name,
  co.opened_at
FROM public.case_openings co
JOIN public.users u ON co.user_id = u.id
ORDER BY co.opened_at DESC
LIMIT 20;
```

### Mejores colecciones
```sql
SELECT 
  u.username,
  COUNT(i.id) as items,
  SUM(i.value) as value
FROM public.users u
LEFT JOIN public.inventory i ON u.id = i.user_id
GROUP BY u.username
ORDER BY value DESC;
```

## 🔧 SOLUCIÓN DE PROBLEMAS

### "Invalid API key"
```
Problema: La API key no es válida
Solución:
1. Ve a: https://app.supabase.com/project/inubqjubhocnfkawziqx/settings/api
2. Copia la "anon" key (la pública)
3. Reemplázala en /lib/supabase.ts
```

### "relation 'public.users' does not exist"
```
Problema: Las tablas no están creadas
Solución: Ejecuta el schema.sql (ver arriba)
```

### "Failed to fetch"
```
Problema: No hay conexión a internet o Supabase está caído
Solución: Verifica tu conexión y status.supabase.com
```

### Items no se guardan
```
Problema: RLS (Row Level Security) bloqueando
Solución: El schema.sql incluye las políticas correctas
Asegúrate de ejecutar TODO el archivo
```

### No puedo iniciar sesión
```
Problema: Usuario no existe o contraseña incorrecta
Solución:
1. Intenta registrarte de nuevo
2. Verifica en Supabase → Authentication
3. Revisa la consola del navegador (F12)
```

## 📁 ARCHIVOS CLAVE

```
📄 Configuración
├── .env                           ← Credenciales (PRIVADO)
├── /lib/supabase.ts              ← Cliente Supabase
└── /database/schema.sql          ← Script de tablas

🎮 Funcionalidad
├── /context/AuthContext.tsx      ← Autenticación
├── /components/inventory/        ← Sistema de inventario
├── /components/cases/            ← Apertura de cajas
└── /components/debug/            ← Indicador de estado

📖 Documentación
├── START_HERE.md                 ← Este archivo
├── README_SUPABASE.md            ← Guía completa
└── SUPABASE_SETUP.md             ← Setup detallado
```

## ✅ CHECKLIST COMPLETO

**Setup Inicial:**
- [ ] npm install ejecutado
- [ ] .env creado con credenciales
- [ ] schema.sql ejecutado en Supabase
- [ ] 4 tablas creadas verificadas
- [ ] npm run dev corriendo

**Primera Prueba:**
- [ ] Registrar usuario de prueba
- [ ] Login exitoso
- [ ] Ver balance $1000 en header
- [ ] Ir a /cases
- [ ] Abrir "Fire Legend" 
- [ ] Ver animación completa
- [ ] Item guardado en inventario
- [ ] Balance actualizado ($501)

**Verificación en Supabase:**
- [ ] Ver usuario en tabla users
- [ ] Ver item en tabla inventory
- [ ] Ver apertura en tabla case_openings
- [ ] RLS políticas activas

**DBeaver (Opcional):**
- [ ] Conexión configurada
- [ ] Tablas visibles
- [ ] Queries funcionando

## 🎯 PRÓXIMO NIVEL

Una vez que todo funciona, puedes agregar:

1. **Marketplace Real**
   - Listar items para venta
   - Comprar de otros usuarios
   - Sistema de transacciones

2. **Live Feed**
   - Supabase Realtime
   - Ver aperturas en vivo
   - Notificaciones

3. **Batallas PvP**
   - Desafiar a otros
   - Apostar items
   - Rankings

4. **Sistema de Logros**
   - Daily rewards
   - Achievements
   - Niveles avanzados

## 🆘 NECESITAS AYUDA?

Si algo no funciona:

1. **Revisa el indicador** (esquina inferior derecha)
2. **Abre la consola** del navegador (F12)
3. **Verifica las tablas** en Supabase
4. **Lee los errores** en rojo

**La mayoría de problemas se resuelven ejecutando el schema.sql correctamente**

---

## 🚀 ¡EMPECEMOS!

**Tu siguiente acción:**
1. Abrir: https://app.supabase.com/project/inubqjubhocnfkawziqx/sql/new
2. Copiar `/database/schema.sql`
3. Pegar y ejecutar
4. ¡Listo! 🎉
