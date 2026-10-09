# Panel de clientes · Ferretería HN

Página pública del servicio "Tu ferretería en línea" (funciones, planes, precios, capturas y contacto) y un panel privado para administrar a tus clientes.

**Público (sin cuenta):** ve los planes y precios, capturas de la tienda, la dirección y el WhatsApp, y puede pedir una demostración.
**Administrador:** entra con el enlace discreto "ENTRAR" (al pie de la página) y desde `/admin`:

- Agrega, edita y elimina clientes; les asigna un plan (Básico, Pro, Premium o los que crees), con dominio o sin él, y un precio o límite especial si quieres.
- Registra pagos (mensualidad, instalación, dominio). Al registrar una mensualidad, la fecha del próximo pago avanza sola.
- Ve quién está vencido o por vencer y le cobra por WhatsApp con un mensaje ya escrito (recordatorio, aviso de atraso, recibo o mensaje libre).
- Copia el código que pone el límite de productos en la tienda del cliente según su plan.
- Cambia los planes y precios que ve el público, sus datos de contacto y los textos de los mensajes.
- Ve las solicitudes de demostración y las convierte en clientes.

Usa el **mismo proyecto de Supabase** que el sitio de la ferretería, con tablas propias (`planes`, `clientes`, `pagos`, `solicitudes_demo`, `ajustes_negocio`, `panel_admins`). Sin Supabase configurado funciona en **modo demostración** con clientes de ejemplo.

## Pasos

1. En Supabase > **SQL Editor**, pega y ejecuta todo `supabase/panel.sql`.
2. Si tu usuario (kenrakasth2009@gmail.com) aún no existe, créalo en **Authentication > Users > Add user** y vuelve a ejecutar la última instrucción del archivo.
3. Publica esta carpeta en Vercel con las mismas dos variables del sitio de la ferretería (`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

Paso a paso con imágenes: `manual/manual-panel-clientes.pdf`.

## Seguridad

- RLS: el público solo puede **leer** los planes visibles y los datos de contacto, y **enviar** solicitudes de demostración. Clientes, pagos y solicitudes solo los ve y cambia quien esté en `panel_admins`.
- Ser administrador de la tienda (`administradores`) no da acceso al panel de clientes.
- El límite de productos de la tienda vive en `plan_tienda`, que el dueño de la tienda no puede modificar desde su panel.

## Probarlo en tu computador

```bash
npm install
npm run dev
```
