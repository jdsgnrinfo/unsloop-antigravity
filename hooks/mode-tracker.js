'use strict';

// Hook PreInvocation de Dr. Unslopovich para Antigravity (Windows, macOS y Linux)
// Gestiona /unsloop-on, /unsloop-off y /unsloop-status y sincroniza el estado global entre chats.
const {
  PLUGIN_ROOT,
  readHookInput,
  writeEmptyHookOutput,
  writeInjectSystemMessage,
  getConfigPath,
  isEnabled,
  setEnabled,
  getSessionState,
  saveSessionState,
  formatBadge,
  getDiagnostics,
  getInstructions,
} = require('./common');

try {
  const data = readHookInput();
  if (!data) {
    writeEmptyHookOutput();
    process.exit(0);
  }

  const conversationId = data.conversationId ? String(data.conversationId) : '';
  const promptRaw = data.lastUserInput ? String(data.lastUserInput) : '';
  const prompt = promptRaw.trim().toLowerCase();
  if (!prompt) {
    writeEmptyHookOutput();
    process.exit(0);
  }

  const stepMarker = data.initialNumSteps !== undefined && data.initialNumSteps !== null
    ? String(data.initialNumSteps)
    : '';
  const turnKey = `${stepMarker}|${prompt}`;
  const state = getSessionState(conversationId);

  // Evitar duplicados dentro del mismo turno del usuario
  if (state.lastTurnKey === turnKey) {
    writeEmptyHookOutput();
    process.exit(0);
  }

  // 1. Trigger /unsloop-off (apagar globalmente)
  if (/^[/@$](unslopovich:)?unsloop-off(\s|$)/.test(prompt)) {
    const cfg = setEnabled(false);
    state.initialized = true;
    state.injectedEnabled = false;
    state.lastTurnKey = turnKey;
    saveSessionState(conversationId, state);

    const badge = formatBadge(false, 'apagado globalmente');
    const msg = [
      'UNSLOPOVICH GLOBAL MODE: OFF',
      `El usuario ejecutó /unsloop-off. Dr. Unslopovich ha sido APAGADO globalmente para este chat y todos los chats futuros (guardado en ${getConfigPath()}, actualizado: ${cfg.updatedAt}).`,
      'Deja de aplicar las reglas y el estilo de Dr. Unslopovich hasta que el usuario ejecute /unsloop-on.',
      'Confirma brevemente al usuario que Unslopovich quedó apagado globalmente y recuérdale que puede encenderlo de nuevo con /unsloop-on o revisar su estado con /unsloop-status.',
    ].join('\n');

    writeInjectSystemMessage(msg, badge);
    process.exit(0);
  }

  // 2. Trigger /unsloop-on (encender globalmente)
  if (/^[/@$](unslopovich:)?unsloop-on(\s|$)/.test(prompt)) {
    const cfg = setEnabled(true);
    state.initialized = true;
    state.injectedEnabled = true;
    state.lastTurnKey = turnKey;
    saveSessionState(conversationId, state);

    const instructions = getInstructions(PLUGIN_ROOT);
    const badge = formatBadge(true, 'encendido globalmente');
    const msg = [
      `El usuario ejecutó /unsloop-on. Dr. Unslopovich ha sido ENCENDIDO globalmente para este chat y todos los chats futuros (guardado en ${getConfigPath()}, actualizado: ${cfg.updatedAt}).`,
      'Confirma brevemente al usuario que Unslopovich quedó encendido globalmente y que ya está activo.',
      '',
      instructions,
    ].join('\n');

    writeInjectSystemMessage(msg, badge);
    process.exit(0);
  }

  // 3. Trigger /unsloop-status (consultar estado global y salud del plugin)
  if (/^[/@$](unslopovich:)?unsloop-status(\s|$)/.test(prompt)) {
    const diag = getDiagnostics(PLUGIN_ROOT);
    state.initialized = true;
    state.injectedEnabled = diag.enabled;
    state.lastTurnKey = turnKey;
    saveSessionState(conversationId, state);

    const statusLabel = diag.enabled ? 'ENCENDIDO (ON)' : 'APAGADO (OFF)';
    const sourceLabel = diag.source === 'default'
      ? 'por defecto (encendido)'
      : 'configuración guardada';
    const updatedLabel = diag.updatedAt || 'nunca modificado (usando valor por defecto)';
    const detectorLabel = diag.detectorExists ? 'disponible' : 'no encontrado';

    const badge = formatBadge(diag.enabled, `estado: ${statusLabel}`);
    const msg = [
      'UNSLOPOVICH STATUS REPORT (hook PreInvocation ejecutado en vivo):',
      `- Estado global: ${statusLabel}`,
      `- Origen del estado: ${sourceLabel}`,
      `- Último cambio: ${updatedLabel}`,
      `- Archivo de configuración global: ${diag.configPath}`,
      '- Hooks de ciclo de vida: operativos (SessionStart + PreInvocation activos)',
      `- Detector estático (detect.js): ${detectorLabel} (${diag.detectorPath})`,
      `- Node.js: ${diag.nodeVersion}`,
      `- Guías de referencia cargadas: ${diag.referenceCount} archivos`,
      '- Comandos disponibles: /unsloop-on, /unsloop-off, /unsloop-status, /unslopovich [review | treat | scan | chart | follow-up]',
      '',
      'Presenta este reporte de estado de forma clara y concisa al usuario (sin volver a ejecutar comandos innecesarios).',
    ].join('\n');

    writeInjectSystemMessage(msg, badge);
    process.exit(0);
  }

  // 4. Sincronización automática en turnos normales
  const globalEnabled = isEnabled();
  const wasInitialized = state.initialized === true;
  const prevInjected = Boolean(state.injectedEnabled);

  state.initialized = true;
  state.injectedEnabled = globalEnabled;
  state.lastTurnKey = turnKey;
  saveSessionState(conversationId, state);

  if (!wasInitialized) {
    if (globalEnabled) {
      const instructions = getInstructions(PLUGIN_ROOT);
      const badge = formatBadge(true, 'activo globalmente');
      writeInjectSystemMessage(instructions, badge);
      process.exit(0);
    }
    writeEmptyHookOutput();
    process.exit(0);
  }

  if (prevInjected !== globalEnabled) {
    if (globalEnabled) {
      const instructions = getInstructions(PLUGIN_ROOT);
      const badge = formatBadge(true, 'reactivado globalmente');
      writeInjectSystemMessage(instructions, badge);
      process.exit(0);
    } else {
      const badge = formatBadge(false, 'apagado globalmente');
      writeInjectSystemMessage(
        'UNSLOPOVICH GLOBAL MODE: OFF — El estado global cambió a apagado. Reanuda el modo normal sin restricciones de Dr. Unslopovich.',
        badge
      );
      process.exit(0);
    }
  }

  writeEmptyHookOutput();
} catch {
  writeEmptyHookOutput();
}
process.exit(0);
