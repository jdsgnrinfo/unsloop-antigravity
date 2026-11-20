'use strict';

// Helpers compartidos multiplataforma (Windows, macOS y Linux) para los hooks de Dr. Unslopovich en Antigravity

const fs = require('fs');
const path = require('path');
const os = require('os');

const PLUGIN_ROOT = path.resolve(__dirname, '..');

function readHookInput() {
  try {
    const raw = fs.readFileSync(0, 'utf8').replace(/^\uFEFF/, '').trim();
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeEmptyHookOutput() {
  process.stdout.write('{}\n');
}

function writeInjectSystemMessage(text, userMarkdown = '') {
  const sysMsg = { systemMessage: text };
  if (userMarkdown && userMarkdown.trim()) {
    sysMsg.metadata = { user_markdown: userMarkdown };
  }
  const payload = {
    injectSteps: [{ systemMessage: sysMsg }],
  };
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function getConfigDir() {
  if (process.env.XDG_CONFIG_HOME && process.env.XDG_CONFIG_HOME.trim()) {
    return path.join(process.env.XDG_CONFIG_HOME, 'unslopovich');
  }
  if (process.platform === 'win32') {
    const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
    return path.join(appData, 'unslopovich');
  }
  return path.join(os.homedir(), '.config', 'unslopovich');
}

function getConfigPath() {
  return path.join(getConfigDir(), 'config.json');
}

function getGlobalConfig() {
  const configPath = getConfigPath();
  const defaults = {
    enabled: true,
    updatedAt: null,
    source: 'default',
  };

  if (fs.existsSync(configPath)) {
    try {
      const raw = fs.readFileSync(configPath, 'utf8').replace(/^\uFEFF/, '');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : true,
          updatedAt: parsed.updatedAt || null,
          source: 'config',
        };
      }
    } catch {
      // Si el archivo está corrupto, volvemos al valor por defecto (encendido)
    }
  }

  return defaults;
}

function isEnabled() {
  return Boolean(getGlobalConfig().enabled);
}

function setEnabled(enabled) {
  const configDir = getConfigDir();
  fs.mkdirSync(configDir, { recursive: true });
  const cfg = {
    enabled: Boolean(enabled),
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(getConfigPath(), JSON.stringify(cfg, null, 2), 'utf8');
  return cfg;
}

function getSessionPath(conversationId) {
  const sessionsDir = path.join(getConfigDir(), 'sessions');
  fs.mkdirSync(sessionsDir, { recursive: true });
  const safeId = conversationId
    ? String(conversationId).replace(/[^A-Za-z0-9._-]/g, '_')
    : 'default';
  return path.join(sessionsDir, `${safeId}.json`);
}

function getSessionState(conversationId) {
  const sessionPath = getSessionPath(conversationId);
  if (fs.existsSync(sessionPath)) {
    try {
      const raw = fs.readFileSync(sessionPath, 'utf8').replace(/^\uFEFF/, '');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch {
      // Ignorar sesión dañada
    }
  }
  return {};
}

function saveSessionState(conversationId, state) {
  try {
    const sessionPath = getSessionPath(conversationId);
    fs.writeFileSync(sessionPath, JSON.stringify(state), 'utf8');
  } catch {
    // No bloquear el flujo si falla el guardado de caché de sesión
  }
}

function formatBadge(enabled, extra = '') {
  const label = enabled ? '🩺 `[UNSLOPOVICH:ON]`' : '🩺 `[UNSLOPOVICH:OFF]`';
  return extra ? `${label} — ${extra}` : label;
}

function getDiagnostics(pluginRoot = PLUGIN_ROOT) {
  const cfg = getGlobalConfig();
  const skillDir = path.join(pluginRoot, 'skills', 'unslopovich');
  const detectorPath = path.join(skillDir, 'scripts', 'detect.js');
  const refDir = path.join(skillDir, 'reference');

  let referenceCount = 0;
  try {
    if (fs.existsSync(refDir)) {
      referenceCount = fs.readdirSync(refDir).filter((f) => f.endsWith('.md')).length;
    }
  } catch {
    referenceCount = 0;
  }

  return {
    enabled: Boolean(cfg.enabled),
    source: cfg.source,
    updatedAt: cfg.updatedAt,
    configPath: getConfigPath(),
    pluginRoot,
    skillDir,
    detectorPath,
    detectorExists: fs.existsSync(detectorPath),
    nodeVersion: process.version,
    referenceCount,
  };
}

function getInstructions(pluginRoot = PLUGIN_ROOT) {
  const skillDir = path.join(pluginRoot, 'skills', 'unslopovich');
  const skillPath = path.join(skillDir, 'SKILL.md');
  const detectorPath = path.join(skillDir, 'scripts', 'detect.js');
  const refDir = path.join(skillDir, 'reference');

  let body = '';
  try {
    if (fs.existsSync(skillPath)) {
      const raw = fs.readFileSync(skillPath, 'utf8').replace(/^\uFEFF/, '');
      body = raw.replace(/^---[\s\S]*?---\s*/, '').trim();
    }
  } catch {
    body = '';
  }

  const header = [
    'UNSLOPOVICH GLOBAL MODE: ACTIVE (ON)',
    `Plugin directory: ${pluginRoot}`,
    `Skill directory (<skill-dir>): ${skillDir}`,
    `Detector script: node "${detectorPath}" <source dirs> --json`,
    '',
    'Global operating rules:',
    '- Unslopovich is enabled globally across all chats by default.',
    `- Whenever a request involves designing, building, editing, reviewing, auditing, or polishing mobile or web UI/UX (SwiftUI, UIKit, Jetpack Compose, React Native, Expo, Flutter, Ionic, Capacitor, React, Next.js, Vue, Nuxt, Svelte, Astro, Angular, HTML/CSS, Tailwind), apply Dr. Unslopovich's standards automatically: prioritize real user friction over aesthetics, follow "The short list" and "Rules that do not bend", read the matching guides in "${refDir}" on demand, and run the detector when reviewing or treating code.`,
    '- If the user request is completely unrelated to UI/UX (e.g., backend-only logic, shell utilities, general Q&A), do NOT force a UI review or inject Unslopovich remarks; stay silent and available.',
    '- Global toggle commands: /unsloop-on (enable globally), /unsloop-off (disable globally), /unsloop-status (check global status).',
  ].join('\n');

  return body ? `${header}\n\n${body}` : header;
}

module.exports = {
  PLUGIN_ROOT,
  readHookInput,
  writeEmptyHookOutput,
  writeInjectSystemMessage,
  getConfigDir,
  getConfigPath,
  getGlobalConfig,
  isEnabled,
  setEnabled,
  getSessionState,
  saveSessionState,
  formatBadge,
  getDiagnostics,
  getInstructions,
};
