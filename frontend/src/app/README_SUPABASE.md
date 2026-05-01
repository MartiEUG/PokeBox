# 🎮 PokeBox - Integración Completa con Supabase

## 🎉 ¡Felicidades! Tu base de datos está conectada

Has conectado exitosamente Supabase a tu plataforma PokeBox. Ahora tienes una base de datos PostgreSQL real que puedes gestionar con DBeaver.

## 📦 ¿Qué se ha implementado?

### ✅ Sistema de Autenticación Completo
- **Registro de usuarios** con validación de username y email
- **Login seguro** con Supabase Auth
- **Sesiones persistentes** - Los usuarios permanecen logueados
- **Protección de datos** con Row Level Security (RLS)

### ✅ Sistema de Inventario
- **Guardar items automáticamente** al abrir cajas
- **Ver inventario completo** en `/inventory`
- **Filtros por rareza** (Common, Rare, Epic, Legendary, Mythic)
- **Calcular valor total** de la colección
- **Fecha de obtención** de cada item

### ✅ Sistema de Apertura de Cajas
- **Deducir balance** automáticamente al abrir
- **Generar items aleatorios** con probabilidades realistas
- **Animaciones de revelación** con efectos visuales
- **Registrar historial** de todas las aperturas

### ✅ Dashboard de Usuario
- **Balance en tiempo real** visible en el header
- **Sistema de niveles** (futuro: XP y progresión)
- **Menú de usuario** con acceso rápido a:
  - Dashboard
  - Inventario
  - Logout

## 🚀 Cómo empezar

### 1. Configurar la Base de Datos

**IMPORTANTE:** Debes ejecutar el script SQL para crear las tablas.

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Click en **SQL Editor** (menú lateral izquierdo)
4. Abre el archivo `/database/schema.sql` de este proyecto
5. **Copia todo el contenido**
6. **Pégalo en el SQL Editor**
7. Click en **Run** (botón verde)

Verás un mensaje de éxito confirmando que las tablas se crearon.

### 2. Verificar las Tablas

En Supabase Dashboard:
1. Ve a **Table Editor** (menú lateral)
2. Deberías ver estas tablas:
   - `users` 👤
   - `inventory` 🎒
   - `case_openings` 📦
   - `marketplace_listings` 🏪

### 3. Probar la Aplicación

1. **Regístrate** en `/register`
2. **Inicia sesión** en `/login`
3. **Abre una caja** en `/cases` - selecciona una y click en "Open Case"
4. **Ve tu inventario** en `/inventory`
5. **Revisa tu dashboard** haciendo click en tu usuario

## 🐘 Conectar DBeaver (Opcional)

DBeaver te permite visualizar y gestionar tu base de datos con una interfaz gráfica.

### Paso 1: Obtener Credenciales

En Supabase Dashboard:
1. Ve a **Settings** → **Database**
2. Busca la sección **Connection string**
3. Anota estos datos:
   - **Host**: `db.xxxxxxxxxxxxx.supabase.co`
   - **Database**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: (tu contraseña de Supabase)

### Paso 2: Configurar DBeaver

1. Abre DBeaver
2. Click **Database** → **New Database Connection**
3. Selecciona **PostgreSQL**
4. Ingresa las credenciales del Paso 1
5. Click **Test Connection**
6. Si funciona, click **Finish**

### Paso 3: Explorar tus Datos

Una vez conectado:
```
Databases → postgres → Schemas → public → Tables
```

Ahí verás todas tus tablas y podrás:
- Ver todos los usuarios registrados
- Explorar inventarios
- Revisar historial de aperturas
- Ejecutar queries personalizadas

## 📊 Queries Útiles

### Ver todos los usuarios
```sql
SELECT 
  username,
  email,
  balance,
  level,
  created_at
FROM public.users
ORDER BY created_at DESC;
```

### Ver items más valiosos
```sql
SELECT 
  u.username,
  i.item_name,
  i.rarity,
  i.value,
  i.obtained_at
FROM public.inventory i
JOIN public.users u ON i.user_id = u.id
ORDER BY i.value DESC
LIMIT 20;
```

### Estadísticas por usuario
```sql
SELECT 
  u.username,
  u.balance,
  COUNT(i.id) as total_items,
  SUM(i.value) as inventory_value,
  COUNT(co.id) as cases_opened
FROM public.users u
LEFT JOIN public.inventory i ON u.id = i.user_id AND i.is_listed = false
LEFT JOIN public.case_openings co ON u.id = co.user_id
GROUP BY u.id, u.username, u.balance
ORDER BY inventory_value DESC;
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
LIMIT 50;
```

## 🔐 Seguridad Implementada

### Row Level Security (RLS)
- ✅ Los usuarios solo pueden ver sus propios datos
- ✅ No pueden modificar datos de otros usuarios
- ✅ Las consultas están protegidas automáticamente

### Políticas de Seguridad
```
Users:
- Pueden ver y editar su propio perfil
- No pueden ver información privada de otros

Inventory:
- Solo accesible por el propietario
- Protegido contra modificaciones no autorizadas

Case Openings:
- Historial privado por usuario
- Solo inserción permitida (no borrado)

Marketplace:
- Listings públicas (cuando se implemente)
- Solo el vendedor puede modificar
```

## 🎯 Funcionalidades Listas para Usar

### 1. Sistema de Usuarios
```typescript
// Ya implementado en AuthContext
const { user, login, register, logout, updateUser } = useAuth();

// Registrar usuario
await register('username', 'email@example.com', 'password');

// Login
await login('email@example.com', 'password');

// Actualizar balance
await updateUser({ balance: newBalance });
```

### 2. Gestión de Inventario
```typescript
// Ya implementado en AuthContext
const { addToInventory, getInventory } = useAuth();

// Agregar item al inventario
await addToInventory({
  name: 'Thunder Stone',
  rarity: 'Epic',
  value: 450,
  caseId: 1
});

// Obtener todos los items
const items = await getInventory();
```

### 3. Registrar Aperturas
```typescript
// Ya implementado en AuthContext
const { recordCaseOpening } = useAuth();

// Registrar apertura
await recordCaseOpening(caseId, caseName, item);
```

## 📁 Estructura de Archivos

```
/lib/supabase.ts          # Cliente de Supabase
/database/schema.sql      # Script de creación de tablas
/context/AuthContext.tsx  # Contexto de autenticación (actualizado)
/components/
  ├── inventory/
  │   └── Inventory.tsx   # Página de inventario (NUEVO)
  ├── cases/
  │   ├── CaseDetail.tsx  # Apertura integrada con BD
  │   └── CaseOpeningModal.tsx
  └── layout/
      └── Header.tsx      # Con enlace a inventario
```

## 🔄 Flujo de Apertura de Caja

1. Usuario hace click en "Open Case"
2. Se verifica balance suficiente
3. Se deduce el costo del balance
4. Se genera un item aleatorio
5. **Se guarda en `inventory` (base de datos)**
6. **Se registra en `case_openings` (historial)**
7. Se actualiza el balance del usuario en BD
8. Se muestra animación de revelación
9. Usuario puede ver el item en `/inventory`

## 🎨 Próximas Funcionalidades Sugeridas

### Marketplace Real
- Listar items para vender
- Comprar items de otros usuarios
- Sistema de ofertas y pujas

### Live Feed en Tiempo Real
- Ver aperturas de otros usuarios en vivo
- Usar Supabase Realtime
- Notificaciones de drops raros

### Sistema de Batallas
- Batallas 1v1 contra otros jugadores
- Apostar items
- Rankings globales

### Recompensas Diarias
- Login rewards
- Achievements
- Sistema de referidos

## 🆘 Solución de Problemas

### "Missing Supabase environment variables"
- Verifica que las variables estén configuradas
- Ve a Settings → API en Supabase
- Asegúrate de que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` existan

### Los items no se guardan
- ✅ Verifica que ejecutaste el script SQL
- ✅ Revisa la consola del navegador (F12)
- ✅ Ve a Supabase → Table Editor → inventory
- ✅ Verifica que existan políticas RLS

### Error de autenticación
- Confirma que el email no esté ya registrado
- La contraseña debe tener mínimo 6 caracteres
- El username debe tener entre 3 y 20 caracteres

### No puedo conectar DBeaver
- Verifica que tu IP esté permitida en Supabase
- Ve a Settings → Database → Connection Pooling
- Asegúrate de usar el puerto 5432
- Verifica usuario y contraseña

## 📚 Recursos Adicionales

- [Documentación Supabase](https://supabase.com/docs)
- [Guía de PostgreSQL](https://www.postgresql.org/docs/)
- [Tutorial de DBeaver](https://dbeaver.io/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🎯 Testing Checklist

Prueba estas funcionalidades para verificar que todo funciona:

- [ ] Registrar un nuevo usuario
- [ ] Iniciar sesión
- [ ] Abrir una caja (verifica que el balance se deduzca)
- [ ] Ver el item en `/inventory`
- [ ] Filtrar items por rareza en inventario
- [ ] Ver el balance actualizado en el header
- [ ] Cerrar sesión
- [ ] Iniciar sesión de nuevo (verifica persistencia)
- [ ] Conectar DBeaver y ver las tablas
- [ ] Ejecutar queries en DBeaver

---

¡Tu plataforma PokeBox ahora tiene una base de datos real y completamente funcional! 🎉
