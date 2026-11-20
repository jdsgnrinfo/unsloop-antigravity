<p align="center">
  <img src="assets/logo.svg" width="128" height="128" alt="Dr. Unslopovich para Antigravity">
</p>

<h1 align="center">unsloop-antigravity</h1>

<p align="center">
  <strong>Dr. Unslopovich (v3.0.0) adaptado por completo como plugin global para Google Antigravity.</strong><br>
  Funciona en todos tus chats por defecto, con encendido/apagado global instantáneo y soporte multiplataforma (Windows, macOS y Linux).
</p>

---

## ¿Qué es esto?

Adaptación completa de [erkamyaman/unslopovich](https://github.com/erkamyaman/unslopovich) a la arquitectura nativa de plugins, skills y hooks de ciclo de vida de **Antigravity**.

Dr. Unslopovich detecta y corrige interfaces con aspecto genérico, de plantilla o generado por IA en **apps móviles** (SwiftUI, UIKit, Jetpack Compose, React Native, Expo, Flutter, Ionic, Capacitor, NativeScript) y **web** (React, Next.js, Vue, Nuxt, Svelte, Astro, Angular, HTML/CSS, Tailwind), priorizando siempre la fricción real de usuario antes que lo puramente estético.

### Características en Antigravity

- **Modo global automático (encendido por defecto):** usa hooks `SessionStart` y `PreInvocation` en Node.js puro (sin dependencias) para aplicarse automáticamente en todos tus chats cuando trabajes en UI/UX, manteniéndose silencioso en tareas que no tienen relación con diseño o frontend.
- **Triggers globales de configuración:**
  - `/unsloop-on` — Enciende Dr. Unslopovich globalmente (chat actual y todos los chats futuros).
  - `/unsloop-off` — Apaga Dr. Unslopovich globalmente (chat actual y todos los chats futuros).
  - `/unsloop-status` — Muestra si está **ENCENDIDO (ON)** o **APAGADO (OFF)** y verifica en vivo los hooks, el detector estático, las 9 guías de referencia y Node.js.
- **Sincronización entre chats:** si apagas o enciendes Unslopovich desde un chat, cualquier otro chat abierto detecta el cambio automáticamente en el siguiente turno.
- **Detector estático incluido:** `skills/unslopovich/scripts/detect.js` con 31 reglas sin dependencias externas.

---

## Requisitos

- **Google Antigravity**
- **Node.js 18 o superior** (usado por los hooks multiplataforma y por el detector `detect.js`)

---

## Instalación rápida

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/jdsgnrinfo/unsloop-antigravity/main/install.ps1 | iex
```

### macOS y Linux (bash / zsh)

```bash
curl -fsSL https://raw.githubusercontent.com/jdsgnrinfo/unsloop-antigravity/main/install.sh | bash
```

### Instalación manual

Clona o descarga este repositorio y copia su contenido en:

- **Windows:** `%USERPROFILE%\.gemini\config\plugins\unslopovich\`
- **macOS / Linux:** `~/.gemini/config/plugins/unslopovich/`

Antigravity detecta el plugin automáticamente en el siguiente turno o al abrir un chat nuevo (no requiere reiniciar).

---

## Comandos disponibles

### Control global

| Comando | Descripción |
| :--- | :--- |
| `/unsloop-status` | Verifica si Dr. Unslopovich está encendido o apagado globalmente y confirma el estado de los hooks y `detect.js`. |
| `/unsloop-off` | Apaga Dr. Unslopovich globalmente en todos los chats. |
| `/unsloop-on` | Enciende Dr. Unslopovich globalmente en todos los chats. |

### Diagnóstico y tratamiento (`/unslopovich`)

| Comando | Descripción |
| :--- | :--- |
| `/unslopovich review [pantallas]` | Diagnóstico completo con puntaje sobre 24, sin editar archivos. |
| `/unslopovich treat [pantallas]` | Diagnóstico, propuesta de dirección, correcciones y verificación antes/después. |
| `/unslopovich scan [ruta]` | Escaneo rápido solo de código usando `detect.js`. |
| `/unslopovich chart` | Crea o actualiza `.unslopovich/chart.md` con las decisiones de marca y excepciones del proyecto. |
| `/unslopovich follow-up [pantallas]` | Re-evalúa pantallas de la última visita y compara puntajes. |

---

## Estructura del plugin

```text
unsloop-antigravity/
├── plugin.json
├── hooks.json
├── hooks/
│   ├── common.js            # Estado global persistente y utilidades cross-platform
│   ├── session-start.js     # Hook SessionStart (encendido por defecto)
│   ├── mode-tracker.js      # Hook PreInvocation (/unsloop-on, /unsloop-off, /unsloop-status)
│   └── cli.js               # Respaldo CLI manual
├── skills/
│   ├── unslopovich/
│   │   ├── SKILL.md
│   │   ├── reference/       # 9 guías de referencia (iOS, Android, Web, Stacks, Tells, etc.)
│   │   └── scripts/         # Detector estático detect.js (31 reglas)
│   ├── unsloop-on/SKILL.md
│   ├── unsloop-off/SKILL.md
│   └── unsloop-status/SKILL.md
├── assets/logo.svg
├── install.ps1
├── install.sh
└── LICENSE
```

---

## Desinstalación

Elimina la carpeta `~/.gemini/config/plugins/unslopovich` (o desactívalo desde **Customizations** en Antigravity). Opcionalmente borra la carpeta de configuración global (`%APPDATA%\unslopovich` en Windows o `~/.config/unslopovich` en macOS/Linux).

---

## Créditos y licencia

Basado en el excelente trabajo de [Erkam Yaman](https://github.com/erkamyaman) en [erkamyaman/unslopovich](https://github.com/erkamyaman/unslopovich) (Licencia MIT). Adaptado a Antigravity con modo global persistente y triggers `/unsloop-on`, `/unsloop-off` y `/unsloop-status`.
