---
name: unsloop-on
description: >-
  Enciende Dr. Unslopovich en modo global para este chat y todos los chats
  futuros de Antigravity. Usar cuando el usuario escriba /unsloop-on o pida
  activar Unslopovich globalmente.
---

# Encender Dr. Unslopovich (`/unsloop-on`)

Activa Dr. Unslopovich en modo global para todos los chats.

## Comportamiento

1. Si el hook `PreInvocation` ya inyectó la confirmación de `UNSLOPOVICH GLOBAL MODE: ACTIVE (ON)` en este turno, responde brevemente confirmando que Dr. Unslopovich está **encendido globalmente** para este y todos los chats futuros.
2. Si por algún motivo el hook no corrió (por ejemplo, si la skill se invocó de forma indirecta sin usar `/unsloop-on`), ejecuta el comando de respaldo (multiplataforma):

```bash
node ~/.gemini/config/plugins/unslopovich/hooks/cli.js on
```

3. Recuerda brevemente al usuario que puede apagarlo con `/unsloop-off` o revisar su estado con `/unsloop-status`.
