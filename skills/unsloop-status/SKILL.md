---
name: unsloop-status
description: >-
  Muestra si Dr. Unslopovich está encendido o apagado globalmente y verifica que
  los hooks, el detector estático y Node.js estén funcionando. Usar cuando el
  usuario escriba /unsloop-status o pregunte si Unslopovich está activo.
---

# Estado de Dr. Unslopovich (`/unsloop-status`)

Reporta si Dr. Unslopovich está activo globalmente y confirma la salud de sus componentes.

## Comportamiento

1. Si el hook `PreInvocation` ya inyectó el bloque `UNSLOPOVICH STATUS REPORT` en este turno, presenta esa información de forma clara y concisa al usuario (sin volver a ejecutar comandos adicionales).
2. Si el bloque no aparece en el contexto del turno actual, ejecuta el diagnóstico manualmente (multiplataforma):

```bash
node ~/.gemini/config/plugins/unslopovich/hooks/cli.js status
```

3. Muestra el estado (**ENCENDIDO (ON)** o **APAGADO (OFF)**), el archivo de configuración global, el estado del detector (`detect.js`) y Node.js, y los comandos `/unsloop-on`, `/unsloop-off` y `/unslopovich`.
