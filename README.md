# Panel de clientes · Ferretería HN

Página pública del servicio "Tu ferretería en línea" (funciones, planes, precios, capturas y contacto) y un panel privado para administrar a tus clientes.

**Público (sin cuenta):** ve los planes y precios, capturas de la tienda, la dirección y el WhatsApp, y puede pedir una demostración.
**Administrador:** entra con el enlace discreto "ENTRAR" (al pie de la página) y desde `/admin`:

- Agrega, edita y elimina clientes; les asigna un plan (Básico, Pro, Premium o los que crees), con dominio o sin él, y un precio o límite especial si quieres.
- Registra pagos (mensualidad, instalación, dominio). Al registrar una mensualidad, la fecha del próximo pago avanza sola.
- Ve quién está vencido o por vencer y le cobra por WhatsApp con un mensaje ya escrito (recordatorio, aviso de atraso, recibo o mensaje libre).
- Crea la tienda en línea del cliente en el mismo paso: su dirección (`/su-tienda`), su usuario y contraseña, y le envía el acceso por WhatsApp.
- El plan, el límite de productos, el dominio y si la tienda está activa se copian solos a su tienda cada vez que guardas, cambias el plan o registras un pago. Un cliente suspendido o cancelado deja su tienda en “Tienda no disponible”.
- Cambia los planes y precios que ve el público, sus datos de contacto y los textos de los mensajes.
- Ve las solicitudes de demostración y las convierte en clientes.

Usa el **mismo proyecto de Supabase** que el sitio de la ferretería, con tablas propias (`planes`, `clientes`, `pagos`, `solicitudes_demo`, `ajustes_negocio`, `panel_admins`). Sin Supabase configurado funciona en **modo demostración** con clientes de ejemplo.

## Pasos

1. En Supabase > **SQL Editor**, pega y ejecuta todo `supabase/panel.sql`.
2. Si tu usuario (kenrakasth2009@gmail.com) aún no existe, créalo en **Authentication > Users > Add user** y vuelve a ejecutar la última instrucción del archivo.
3. Ejecuta `multitienda.sql` del sitio de las tiendas (`sitio-ferreteria/supabase/multitienda.sql`).
4. Publica esta carpeta en Vercel con estas variables:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Igual que en el sitio de las tiendas |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Igual que en el sitio de las tiendas |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Project Settings > API > **service_role** (secreta) |
| `URL_TIENDAS` | Dirección del sitio de las tiendas, por ejemplo `https://sitio-ferreteria.vercel.app` |

La clave `service_role` permite crear usuarios y tiendas. Ponla **solo** en Vercel, nunca en un archivo que subas a GitHub ni en una variable que empiece con `NEXT_PUBLIC_`.

Paso a paso con imágenes: `manual/manual-panel-clientes.pdf`.

## Seguridad

- RLS: el público solo puede **leer** los planes visibles y los datos de contacto, y **enviar** solicitudes de demostración. Clientes, pagos y solicitudes solo los ve y cambia quien esté en `panel_admins`.
- Ser administrador de la tienda (`administradores`) no da acceso al panel de clientes.
- El límite de productos, el plan, el dominio y si la tienda está activa viven en la tabla `tiendas`; el dueño de la tienda no puede cambiarlos desde su panel.
- La clave `service_role` solo se usa en el servidor, después de comprobar que quien pide es administrador del panel.
- Al eliminar un cliente, su tienda queda suspendida; sus productos no se borran.

## Probarlo en tu computador

```bash
npm install
npm run dev
```
