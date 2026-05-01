# 🔥 Guía de Configuración Supabase para PokeBox

## 📋 Paso 1: Configurar las Tablas en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **SQL Editor** en el menú lateral
3. Copia todo el contenido del archivo `/database/schema.sql`
4. Pega el código SQL en el editor
5. Haz clic en **Run** para ejecutar el script

Esto creará todas las tablas necesarias:
- `users` - Perfiles de usuarios con balance y nivel
- `inventory` - Items obtenidos por los usuarios
- `case_openings` - Historial de aperturas de cajas
- `marketplace_listings` - Listados del marketplace

## 🔧 Paso 2: Configurar Variables de Entorno

Ya que has conectado Supabase, tus variables de entorno deberían estar configuradas automáticamente:
- `VITE_SUPABASE_URL` - La URL de tu proyecto Supabase
- `VITE_SUPABASE_ANON_KEY` - La clave anónima pública

Puedes verificar estas variables en tu Dashboard de Supabase en **Settings > API**.

## 🐘 Paso 3: Conectar DBeaver a tu Base de Datos

### Obtener Credenciales de Conexión

1. En Supabase Dashboard, ve a **Settings > Database**
2. Encuentra la sección **Connection string**
3. Copia la cadena de conexión en modo **URI**

### Configurar DBeaver

1. Abre DBeaver
2. Click en **Database > New Database Connection**
3. Selecciona **PostgreSQL**
4. Ingresa los siguientes datos (obtenidos de Supabase):

```
Host: db.[TU_PROYECTO_REF].supabase.co
Port: 5432
Database: postgres
Username: postgres
Password: [TU_PASSWORD_DE_SUPABASE]
```

5. Click en **Test Connection** para verificar
6. Click en **Finish**

### Navegar a las Tablas

Una vez conectado:
1. Expande tu conexión en el navegador
2. Navega a: `Databases > postgres > Schemas > public > Tables`
3. Verás todas tus tablas: `users`, `inventory`, `case_openings`, `marketplace_listings`

## 📊 Queries Útiles para DBeaver

### Ver todos los usuarios
```sql
SELECT * FROM public.users;
```

### Ver inventario de un usuario específico
```sql
SELECT 
  i.item_name,
  i.rarity,
  i.value,
  i.obtained_at,
  u.username
FROM public.inventory i
JOIN public.users u ON i.user_id = u.id
WHERE u.username = 'TU_USERNAME';
```

### Ver historial de aperturas recientes
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

### Ver valor total del inventario por usuario
```sql
SELECT 
  u.username,
  COUNT(i.id) as total_items,
  SUM(i.value) as total_value
FROM public.users u
LEFT JOIN public.inventory i ON u.id = i.user_id AND i.is_listed = false
GROUP BY u.id, u.username
ORDER BY total_value DESC;
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
WHERE i.is_listed = false
ORDER BY i.value DESC
LIMIT 10;
```

## 🔐 Seguridad

- ✅ Row Level Security (RLS) está activado
- ✅ Los usuarios solo pueden ver/editar sus propios datos
- ✅ Las políticas de seguridad protegen la información privada
- ✅ La autenticación se maneja de forma segura con Supabase Auth

## 🚀 Funcionalidades Implementadas

### Sistema de Autenticación
- ✅ Registro de usuarios con validación
- ✅ Login con email/password
- ✅ Sesiones persistentes
- ✅ Protección de rutas

### Sistema de Inventario
- ✅ Guardar items al abrir cajas
- ✅ Ver inventario completo
- ✅ Filtrar por rareza
- ✅ Calcular valor total

### Sistema de Aperturas
- ✅ Deducir balance al abrir cajas
- ✅ Generar items aleatorios con probabilidades
- ✅ Registrar historial de aperturas
- ✅ Animaciones de revelación

### Dashboard y Perfil
- ✅ Ver balance en tiempo real
- ✅ Sistema de niveles
- ✅ Menú de usuario con navegación
- ✅ Logout seguro

## 📝 Próximos Pasos Sugeridos

1. **Marketplace Real**
   - Implementar listado de items
   - Sistema de compra/venta entre usuarios
   - Comisiones y fees

2. **Sistema de Batallas**
   - Batallas entre jugadores
   - Apuestas con items
   - Rankings y estadísticas

3. **Live Feed Real**
   - Mostrar aperturas en tiempo real
   - Usar Supabase Realtime
   - Notificaciones de drops raros

4. **Sistema de Recompensas**
   - Daily rewards
   - Achievements
   - Referral system

## 🆘 Troubleshooting

### Error: "Missing Supabase environment variables"
- Verifica que tus variables de entorno estén configuradas
- Revisa el archivo `.env` o las variables en tu plataforma de hosting

### Error de conexión en DBeaver
- Verifica que la IP de tu computadora esté permitida en Supabase
- Ve a Settings > Database > Connection pooling
- Asegúrate de usar el puerto correcto (5432)

### Los datos no se guardan
- Revisa la consola del navegador para errores
- Verifica que las políticas RLS estén configuradas correctamente
- Asegúrate de que el usuario esté autenticado

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [DBeaver Guía de Usuario](https://dbeaver.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
