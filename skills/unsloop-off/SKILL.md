---
name: unsloop-off
description: >-
  Apaga Dr. Unslopovich en modo global para este chat y todos los chats futuros
  de Antigravity. Usar cuando el usuario escriba /unsloop-off o pida desactivar
  Unslopovich globalmente.
---

# Apagar Dr. Unslopovich (`/unsloop-off`)

Apaga Dr. Unslopovich en modo global para todos los chats.

## Comportamiento

1. Si el hook `PreInvocation` ya inyectó la confirmación de `UNSLOPOVICH GLOBAL MODE: OFF` en este turno, responde brevemente confirmando que Dr. Unslopovich quedó **apagado globalmente** para este y todos los chats futuros.
2. Si por algún motivo el hook no corrió (por ejemplo, si la skill se invocó de forma indirecta sin usar `/unsloop-off`), ejecuta el comando de respaldo (multiplataforma):

```bash
node ~/.gemini/config/plugins/unslopovich/hooks/cli.js off
```

3. Deja de aplicar las reglas de Dr. Unslopovich y recuérdale al usuario que puede reactivarlo en cualquier momento con `/unsloop-on` o verificar el estado con `/unsloop-status`.
